const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');

// GET all resources with Donor names
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    if (category) filter.category = category;

    const resources = await Resource.find(filter)
      .populate('donor', 'name email') // Swaps ID for Donor Object
      .sort({ createdAt: -1 });
    
    res.json(resources);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new resource
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, unit, donor } = req.body;
    const newResource = new Resource({
      name,
      category,
      quantity,
      unit,
      donor: donor || null
    });

    const saved = await newResource.save();
    const populated = await Resource.findById(saved._id).populate('donor', 'name');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE resource
router.delete('/:id', async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;