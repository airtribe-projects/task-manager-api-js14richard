const express = require('express');
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

// ---------------- Validator Utils ----------------
function validateTaskInput(title, description, completed, priority, isUpdate = false) {
    if (!isUpdate || title !== undefined) {
        if (!title || typeof title !== 'string' || title.trim() === '') {
            return "Title must be a non-empty string";
        }
    }

    if (!isUpdate || description !== undefined) {
        if (!description || typeof description !== 'string' || description.trim() === '') {
            return "Description must be a non-empty string";
        }
    }

    if (completed !== undefined && typeof completed !== 'boolean') {
        return "Completed must be a boolean value";
    }

    if (priority !== undefined && !['low', 'medium', 'high'].includes(priority)) {
        return "Priority must be one of: low, medium, high";
    }

    return null;
}

// API Endpoints

// GET /tasks?completed=true&sort=asc
app.get('/tasks', (req, res) => {
    let result = [...tasks];

    if (req.query.completed !== undefined) {
        const completed = req.query.completed === 'true';
        result = result.filter(t => t.completed === completed);
    }

    if (req.query.sort === 'asc') {
        result.sort((a, b) => a.createdAt - b.createdAt);
    } else if (req.query.sort === 'desc') {
        result.sort((a, b) => b.createdAt - a.createdAt);
    }

    res.status(200).json(result);
});

// GET /tasks/priority/:level
app.get('/tasks/priority/:level', (req, res) => {
    const level = req.params.level.toLowerCase();

    if (!['low', 'medium', 'high'].includes(level)) {
        return res.status(400).json({ message: "Invalid priority level" });
    }

    const result = tasks.filter(t => t.priority === level);
    res.status(200).json(result);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// POST /tasks
app.post('/tasks', (req, res) => {
    const { title, description, completed, priority } = req.body;
    const error = validateTaskInput(title, description, completed, priority);
    if (error) return res.status(400).json({ message: error });

    const newTask = {
        id: nextId++,
        title: title.trim(),
        description: description.trim(),
        completed: completed ?? false,
        priority: priority ?? 'medium',
        createdAt: new Date()
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

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
app.delete('/tasks/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) return res.status(404).json({ message: 'Task not found' });

    tasks.splice(index, 1);
    res.status(200).json({ message: 'Task deleted successfully' });
});

// ---------------- Server ----------------
app.listen(port, (err) => {
    if (err) return console.log('Something bad happened', err);
    console.log(`Server is listening on ${port}`);
});

module.exports = app;
