const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const authRoutes = require('./routes/auth.js');
const petRoutes = require('./routes/pet.js');
const formRoutes = require('./routes/form.js');
const { connectToDatabase } = require('./db');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging middleware (optional for development)
app.use((req, res, next) => {
  if (req.url !== '/_next/webpack-hmr') {  // Skip logging HMR requests
      console.log(`${req.method} ${req.url}`);
  }
  next();
});

// Serve static files from the temp/pets directory
app.use('/temp/pets', express.static(path.join(__dirname, 'temp/pets')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/form', formRoutes);

// Start the server
app.listen(process.env.PORT, async () => {
  try {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
      db = await connectToDatabase();
      console.log('is connected to db...', !!db);
  } catch (error) {
      console.error("Failed to start server:", error);
  }
}).on('error', (err) => {
  console.error('Failed to start server:', err);
});
