const express = require('express');
const { connectToDatabase } = require('../db');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.SECRET_KEY;
const router = express.Router();
let db;

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Token required');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Invalid or expired token');
        req.user = user;
        next();
    });
};

// Add volunteer form
router.post('/volunteer', async (req, res) => {
  console.log(req.body);
  const { name, phone, email, skills, availability1, availability2, availability3, type } = req.body;
  try {

    // Validate input
    if (!name || !phone || !email || !skills || (!availability1 && !availability2 && !availability3) || !type) {
      return res.status(400).json({ message: "All fields are required" });
    }
    db = await connectToDatabase();
    if (!db) {
        return res.status(500).json({ message: "Database access failed" });
    }

    const v_collection = db.collection('VolunteerFormSubmission');

    const data = {name, phone, email, skills, availability1, availability2, availability3, type};

    const result = await v_collection.insertOne(data);
    return res.status(201).json({ message: "Volunteer form posted successfully", _id: result.insertedId });

  } catch (err) {
    console.error("Failed to post volunteer:", err);
    res.status(500).json({ error: err.message, message: "Failed to post volunteer" });
  }
});

// Add donate form
router.post('/donate', async (req, res) => {
    console.log(req.body);
    const { donationAmount, cardName, cardNumber, cardExpirationMonth, cardExpirationYear, cvc } = req.body;
    try {
  
      // Validate input
        if (!donationAmount || !cardName || !cardNumber || !cardExpirationMonth || !cardExpirationYear || !cvc) {
            return res.status(400).json({ message: "All fields are required" });
        }
        db = await connectToDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database access failed" });
        }
    
        const d_collection = db.collection('donationFormSubmission');
    
        const data = {donationAmount, cardName, cardNumber, cardExpirationMonth, cardExpirationYear, cvc};
    
        const result = await d_collection.insertOne(data);
        return res.status(201).json({ message: "Donation payment form posted successfully", _id: result.insertedId });
    
    } catch (err) {
        console.error("Failed to post form:", err);
        res.status(500).json({ error: err.message, message: "Failed to post form" });
    }
});

// Add contact form
router.post('/contact', async (req, res) => {
    console.log(req.body);
    const { contactName, contactEmail, contactMessage } = req.body;
    try {
  
      // Validate input
        if (!contactName || !contactEmail || !contactMessage) {
            return res.status(400).json({ message: "All fields are required" });
        }
        db = await connectToDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database access failed" });
        }
    
        const c_collection = db.collection('contactFormSubmission');
    
        const data = {contactName, contactEmail, contactMessage};
    
        const result = await c_collection.insertOne(data);
        return res.status(201).json({ message: "Contact form posted successfully", _id: result.insertedId });
    
    } catch (err) {
        console.error("Failed to post form:", err);
        res.status(500).json({ error: err.message, message: "Failed to post form" });
    }
});

// Add adoption form
router.post('/adopt', async (req, res) => {
    console.log(req.body);
    const { fullName, email, phone, address, houseSize, haveYard, haveOtherPet, environmentDescription, adoptionReason } = req.body;
    try {
  
      // Validate input
        if (!fullName || !email || !phone || !address || !houseSize || !environmentDescription || !adoptionReason) {
            return res.status(400).json({ message: "All fields are required" });
        }
        db = await connectToDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database access failed" });
        }
    
        const ad_collection = db.collection('adoptionFormSubmission');
    
        const data = {fullName, email, phone, address, houseSize, haveYard, haveOtherPet, environmentDescription, adoptionReason};
    
        const result = await ad_collection.insertOne(data);
        return res.status(201).json({ message: "Adoption form posted successfully", _id: result.insertedId });
    
    } catch (err) {
        console.error("Failed to post form:", err);
        res.status(500).json({ error: err.message, message: "Failed to post form" });
    }
});

// Get all adoption form
router.get('/adopt', authenticateToken, async (req, res) => {
    try {
        db = await connectToDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database access failed" });
        }

        const ad_collection = db.collection('adoptionFormSubmission');
        const results = await ad_collection.find().toArray(); // Convert cursor to array
        return res.status(200).json({ message: "Adoption forms fetched successfully", results });
    } catch (err) {
        console.error("Failed to fetch form:", err);
        res.status(500).json({ error: err.message, message: "Failed to fetch form" });
    }
});

// Get all donation form
router.get('/donate', authenticateToken, async (req, res) => {
    try {
        db = await connectToDatabase();
        if (!db) {
            return res.status(500).json({ message: "Database access failed" });
        }

        const d_collection = db.collection('donationFormSubmission');
        const results = await d_collection.find().toArray(); // Convert cursor to array
        return res.status(200).json({ message: "Donations fetched successfully", results });
    } catch (err) {
        console.error("Failed to fetch form:", err);
        res.status(500).json({ error: err.message, message: "Failed to fetch form" });
    }
});


module.exports = router;
