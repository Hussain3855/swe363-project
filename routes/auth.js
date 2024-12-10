const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { ObjectId } = require('mongodb');
const { connectToDatabase } = require('../db');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const router = express.Router();
let db;

// Register
router.post('/register', async (req, res) => {
  console.log(req.body);
  const { username, role, password } = req.body;
  try {

    // Validate input
    if (!username || !role || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    db = await connectToDatabase();
    if (!db) {
        return res.status(500).json({ message: "Database access failed" });
    }

    const usersCollection = db.collection('User');

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {username, role, password: hashedPassword};

    const result = await usersCollection.insertOne(newUser);
    return res.status(201).json({ message: "User registered successfully", _id: result.insertedId });

  } catch (err) {
    console.error("Failed to registered user:", err);
    res.status(500).json({ error: err.message, message: "Failed to registered user" });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Connect to database
    const db = await connectToDatabase();
    if (!db) { return res.status(500).json({ message: "Database access failed" }); }

    const usersCollection = db.collection('User');

    const user = await usersCollection.findOne({ username });
    if (!user) { return res.status(404).json({ error: "User not found" }); }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) { return res.status(400).json({ error: "Invalid credentials" }); }

    // JWT token
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: "Login successful", token, role: user.role });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Verify Token
router.post('/verify-token', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  try {
    // Input validation
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Connect to database
    const db = await connectToDatabase();
    if (!db) { return res.status(500).json({ message: "Database access failed" }); }

    const usersCollection = db.collection('User');

    // Check if the user exists in the database
    const user = await usersCollection.findOne({ _id: new ObjectId(decoded.id) });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Token is valid, return success response
    res.status(200).json({ message: "Token is valid", role: user.role });
  } catch (err) {
    console.error("Token verification error:", err);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
});


module.exports = router;
