const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Serve Frontend (static files from client/dist)
const distPath = path.resolve(__dirname, '..', 'client', 'dist');
app.use(express.static(distPath));

// Catch-all to serve React App
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(distPath, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Mini CRM running on http://localhost:${PORT}`);
  console.log(`📂 Serving frontend from: ${distPath}`);
});
