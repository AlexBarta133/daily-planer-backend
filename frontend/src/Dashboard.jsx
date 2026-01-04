import { useNavigate } from "react-router-dom";
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

function Dashboard() {
  const navigate = useNavigate();
  const [taskCounts, setTaskCounts] = useState({});

  const today = new Date();

  const days = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d.toISOString().split("T")[0]);
  }
  
  useEffect(() => {
  days.forEach((date) => {
    fetch(`http://localhost:3000/task/list?date=${date}`)
      .then((res) => res.json())
      .then((tasks) => {
        setTaskCounts((prev) => ({
          ...prev,
          [date]: {
            total: tasks.length,
            completed: tasks.filter(t => t.completed === true).length,
          },
        }));
      });
  });
}, []);



  return (
     <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "32px" }}>
    <h1 style={{ textAlign: "center" }}>Dashboard</h1>


      {days.map((date) => (
  <div
  onClick={() => navigate(`/day/${date}`)}
  style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#ffffff",
  padding: "50px 28px",
  fontSize: "16px",
  marginBottom: "12px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  cursor: "pointer",
  transition: "all 0.15s ease"
}}

  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#fafafa")}
>

    <div style={{ fontWeight: "600", fontSize: "17px" }}>
  {formatDate(date)}
    </div>


<div style={{ color: "#666", fontSize: "14px" }}>
  {!taskCounts[date] || taskCounts[date].total === 0
    ? "Volno 🎉"
    : taskCounts[date].total > 0 &&
      taskCounts[date].completed === taskCounts[date].total
    ? "Splněno 🙂"
    : `Úkoly ${taskCounts[date].total}`}
</div>

  </div>
))}

    </div>
  );
}

export default Dashboard;
