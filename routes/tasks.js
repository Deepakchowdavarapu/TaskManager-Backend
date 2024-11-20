const express = require('express');
const Task = require('../Models/TaskModel');
const authenticateToken = require('../Middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        if (!title || !description || !dueDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const task = new Task({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.user.id 
        });

        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', authenticateToken, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ userId: req.user.id, _id: id });

        if (!task) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const updatedTask = await Task.findOneAndUpdate(
            { userId: req.user.id, _id: id },
            { title, description, status, priority, dueDate },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTask = await Task.findOneAndDelete({ userId: req.user.id, _id: id });

        if (!deletedTask) {
            return res.status(404).json({ error: 'No task found' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:id/reminder', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { reminderDate } = req.body;

    if (!reminderDate) {
        return res.status(400).json({ error: 'Missing reminder date' });
    }

    try {
        const task = await Task.findOne({ userId: req.user.id, _id: id });

        if (!task) {
            return res.status(404).json({ error: 'No task found' });
        }

        task.reminderDate = reminderDate;
        await task.save();

        scheduleEmailReminder(task, reminderDate);

        res.status(200).json({ message: 'Reminder set successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;