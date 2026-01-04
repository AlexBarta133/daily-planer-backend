import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function formatDate(dateStr) {
  const d = new Date(dateStr);

  return d.toLocaleDateString("cs-CZ", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}


function Day() {
  const { date } = useParams();
  const [tasks, setTasks] = useState([]);

  const [name, setName] = useState("");
  const [priority, setPriority] = useState(1);

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPriority, setEditPriority] = useState(1);

  function loadTasks() {
    fetch(`http://localhost:3000/task/list?date=${date}`)
      .then((res) => res.json())
      .then((data) =>
  setTasks(data.sort((a, b) => b.priority - a.priority))
);
}

function startEdit(task) {
  setEditingTaskId(task.id);
  setEditName(task.name);
  setEditPriority(task.priority);
}

function saveEdit(id) {
  fetch("http://localhost:3000/task/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id,
      name: editName,
      priority: Number(editPriority),
    }),
  }).then(() => {
    setEditingTaskId(null);
    loadTasks();
  });
}


  useEffect(() => {
    loadTasks();
  }, [date]);

  function addTask() {
  if (!name.trim()) {
    alert("Zadej název úkolu 🙂");
    return;
  }

  fetch("http://localhost:3000/task/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      date,
      priority: Number(priority),
    }),
  }).then(() => {
    setName("");
    setPriority(1);
    loadTasks();
  });
}

function deleteTask(id) {
  fetch("http://localhost:3000/task/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).then(() => loadTasks());
}
function priorityColor(priority) {
  const p = Number(priority);

  if (p === 1) return "green";
  if (p === 2) return "blue";
  if (p === 3) return "red";
}


function toggleCompleted(task) {
  fetch("http://localhost:3000/task/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: task.id,
      completed: !task.completed,
    }),
  }).then(() => loadTasks());
}

  return (
    <div style={{ 
    maxWidth: "900px", 
    margin: "0 auto", 
    padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>
  Plán na den: {formatDate(date)}
</h1>

      


      <h2>Přidat úkol</h2>
      <input
        placeholder="Název úkolu"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value={1}>Nízká</option>
        <option value={2}>Střední</option>
        <option value={3}>Vysoká</option>
      </select>

      <button onClick={addTask}>Přidat</button>

      <hr />

      {tasks.length === 0 && <p>Volno 🎉</p>}


<div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
  {tasks.map((task) => (
    <div
      key={task.id}
      style={{
        border: "1px solid #ddd",
        padding: "16px 20px",
        borderRadius: "12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      }}
    >
      {editingTaskId === task.id ? (
        <>
          <input
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <select
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
          >
            <option value={1}>Nízká</option>
            <option value={2}>Střední</option>
            <option value={3}>Vysoká</option>
          </select>

          <button onClick={() => saveEdit(task.id)}>Uložit</button>
        </>
      ) : (
        <>
          {/* LEVÁ ČÁST – checkbox + název */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              maxWidth: "70%",
              overflow: "hidden",
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />

            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                textDecoration: task.completed ? "line-through" : "none",
                color:
                  Number(task.priority) === 3
                    ? "red"
                    : Number(task.priority) === 2
                    ? "blue"
                    : "green",
                fontWeight: "bold",
              }}
              title={task.name}
            >
              {task.name}
            </span>
          </div>

          {/* PRAVÁ ČÁST – tlačítka */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => startEdit(task)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              Upravit
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              style={{
                padding: "6px 10px",
                borderRadius: "6px",
                border: "1px solid #f5c6cb",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                cursor: "pointer",
              }}
            >
              Smazat
            </button>
          </div>
        </>
      )}
    </div>
  ))}
</div>
    </div>
  );
}

export default Day;
