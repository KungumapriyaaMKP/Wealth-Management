const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Transaction = require('../models/Transaction');

// Get all projects for user
router.get('/', auth, async (req, res) => {
    try {
        const projects = await Project.find({ user_id: req.user.id }).sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create a new project
router.post('/', auth, async (req, res) => {
    try {
        const { name, description, budget } = req.body;
        const newProject = new Project({
            user_id: req.user.id,
            name,
            description,
            budget: budget || 0
        });
        const project = await newProject.save();
        res.json(project);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get transactions for a specific project
router.get('/:id/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id, project_id: req.params.id }).sort({ date: -1 });
        res.json(transactions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });
        
        if (project.user_id.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await project.remove();
        res.json({ message: 'Project removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
