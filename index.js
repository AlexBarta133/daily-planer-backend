const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let tasks = [];

// 🟢 LIST TASKS
app.get("/task/list", (req, res) => {
  const { date } = req.query;
  const result = tasks.filter((t) => t.date === date);
  res.json(result);
});

// 🟢 CREATE TASK
app.post("/task/create", (req, res) => {
  const { name, date, priority } = req.body;

  if (!name || !date || !priority) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const task = {
    id: Date.now().toString(),
    name,
    date,
    priority,
    completed: false,
  };

  tasks.push(task);
  res.json(task);
});

// 🟢 UPDATE TASK
app.post("/task/update", (req, res) => {
  const { id, name, priority, completed } = req.body;

  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (name !== undefined) task.name = name;
  if (priority !== undefined) task.priority = priority;
  if (completed !== undefined) task.completed = completed;

  res.json(task);
});

// 🟢 DELETE TASK
app.post("/task/delete", (req, res) => {
  const { id } = req.body;
  tasks = tasks.filter((t) => t.id !== id);
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.send("Daily Planner API");
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
