const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
  {
    id: 1,
    title: "Set up environment",
    description: "Install Node.js, npm, and git",
    completed: true,
    priority: "medium",
    createdAt: new Date()
  }
];

let nextId = 2;

// ---------------- Utilities ----------------
function parseId(idParam) {
  if (!/^\d+$/.test(idParam)) return null;
  return Number(idParam);
}

function validateTaskInput(title, description, completed, priority, isUpdate = false) {

  if (!isUpdate || title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return `Expected title to be a non-empty string, but got ${typeof title}`;
    }
  }

  if (!isUpdate || description !== undefined) {
    if (typeof description !== "string" || description.trim() === "") {
      return `Expected description to be a non-empty string, but got ${typeof description}`;
    }
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    return `Expected completed to be a boolean, but got ${typeof completed}`;
  }

  if (priority !== undefined && !["low", "medium", "high"].includes(priority)) {
    return "Priority must be one of: low, medium, high";
  }

  return null;
}

// ---------------- Routes ----------------

// GET /tasks
app.get("/tasks", (req, res) => {
  let result = [...tasks];

  if (req.query.completed !== undefined) {
    if (!["true", "false"].includes(req.query.completed)) {
      return res.status(400).json({ message: "completed must be true or false" });
    }
    result = result.filter(t => t.completed === (req.query.completed === "true"));
  }

  if (req.query.sort !== undefined) {
    if (!["asc", "desc"].includes(req.query.sort)) {
      return res.status(400).json({ message: "sort must be asc or desc" });
    }
    result.sort((a, b) =>
      req.query.sort === "asc" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt
    );
  }

  res.status(200).json(result);
});

// GET /tasks/:id
app.get("/tasks/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Invalid task id" });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.status(200).json(task);
});

// POST /tasks
app.post("/tasks", (req, res) => {
  const body = req.body || {};
  const { title, description, completed, priority } = body;

  const error = validateTaskInput(title, description, completed, priority);
  if (error) return res.status(400).json({ message: error });

  const newTask = {
    id: nextId++,
    title: title.trim(),
    description: description.trim(),
    completed: completed ?? false,
    priority: priority ?? "medium",
    createdAt: new Date()
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put("/tasks/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Invalid task id" });

  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const { title, description, completed, priority } = req.body;

  const error = validateTaskInput(title, description, completed, priority, true);
  if (error) return res.status(400).json({ message: error });

  if (title !== undefined) task.title = title.trim();
  if (description !== undefined) task.description = description.trim();
  if (completed !== undefined) task.completed = completed;
  if (priority !== undefined) task.priority = priority;

  res.status(200).json(task);
});

// DELETE /tasks/:id
app.delete("/tasks/:id", (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ message: "Invalid task id" });

  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  tasks.splice(index, 1);
  res.status(200).json({ message: "Task deleted successfully" });
});

// ---------------- Server ----------------
app.listen(port, (err) => {
  if (err) return console.log("Something bad happened", err);
  console.log(`Server is listening on ${port}`);
});

module.exports = app;
