const mongoose = require('mongoose');

const LeadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    source: {
        type: String,
        required: true,
        default: 'Website Contact Form'
    },
    status: {
        type: String,
        enum: ['New', 'Contacted', 'Converted'],
        default: 'New'
    },
    notes: [{
        content: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Lead', LeadSchema);
