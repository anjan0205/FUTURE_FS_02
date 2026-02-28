const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const crypto = require('crypto');

const mongoose = require('mongoose');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// API Routes
app.use('/api/leads', require('./routes/leads'));

// Serve Frontend
const distPath = path.resolve(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// Catch-all to serve React App
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Combined Mini CRM running on http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${distPath}`);
});
