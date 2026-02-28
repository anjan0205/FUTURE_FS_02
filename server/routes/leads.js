const express = require('express');
const router = express.Router();
const Lead = require('../models/Lead');

// @route   GET /api/leads
// @desc    Get all leads
router.get('/', async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });
        res.json(leads);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   POST /api/leads
// @desc    Create a new lead
router.post('/', async (req, res) => {
    const { name, email, source, status } = req.body;
    const newLead = new Lead({ name, email, source, status });

    try {
        const savedLead = await newLead.save();
        res.status(201).json(savedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PATCH /api/leads/:id
// @desc    Update lead status or add notes
router.patch('/:id', async (req, res) => {
    try {
        const lead = await Lead.findById(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });

        if (req.body.status) lead.status = req.body.status;
        if (req.body.note) {
            lead.notes.push({ content: req.body.note });
        }

        const updatedLead = await lead.save();
        res.json(updatedLead);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/leads/:id
// @desc    Delete a lead
router.delete('/:id', async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ message: 'Lead not found' });
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
