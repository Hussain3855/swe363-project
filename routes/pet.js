const express = require('express');
const router = express.Router();
const petService = require('../services/pet.services');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');


const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Token required');

  jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).send('Invalid or expired token');
      req.user = user;
      next();
  });
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '../temp/pets'); // Adjust path as needed
      
      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
          fs.mkdirSync(uploadPath, { recursive: true });
      }
      
      cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/', authenticateToken, upload.single('picture'), async (req, res) => {
  try {
      const petData = {
          name: req.body.name,
          type: req.body.type,
          othertype: req.body.othertype,
          breed: req.body.breed,
          age: req.body.age,
          size: req.body.size,
          gender: req.body.gender,
          location: req.body.location,
          price: req.body.price,
          description: req.body.description,
          picturePath: req.file ? req.file.path : null, // Save file path
      };

      console.log('Adding pet:', petData);

      const result = await petService.addPet(petData);
      if (result.success) {
          res.status(201).json({ message: 'Pet added successfully', id: result.id });
      } else {
          res.status(500).json({ error: result.error });
      }
  } catch (err) {
      console.error('Error adding pet:', err);
      res.status(500).json({ error: err.message });
  }
});

// Get all pets or filter pets
router.get('/', authenticateToken,  async (req, res) => {
  const filters = req.query; // Optional filters from query params

  const result = await petService.getPets(filters);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get pet by ID
router.get('/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;

  const result = await petService.getPetById(petId);
  if (result.success) {
    res.status(200).json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Update a pet by ID
router.put('/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;
  const updatedData = req.body;

  const result = await petService.updatePet(petId, updatedData);
  if (result.success) {
    res.status(200).json({ message: 'Pet updated successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Delete a pet by ID
router.delete('/:id', authenticateToken, async (req, res) => {
  const petId = req.params.id;

  const result = await petService.deletePet(petId);
  if (result.success) {
    res.status(200).json({ message: 'Pet deleted successfully' });
  } else {
    res.status(500).json({ error: result.error });
  }
});

module.exports = router;
