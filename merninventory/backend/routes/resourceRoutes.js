const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const verifyToken = require('../middleware/auth');

// Get inventory count
router.get('/count', async (req, res) => {
  try {
    const count = await Resource.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.use(verifyToken);

// Route to get all inventory items
router.get('/', async (req, res) => {
  try {
    const items = await Resource.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching inventory items' });
  }
});

// Route to add a new inventory item
router.post('/add', async (req, res) => {
  const { name, quantity, price } = req.body;
  try {
    const newItem = new InventoryItem({ name, quantity, price });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Error adding item' });
  }
});



// Route to update an inventory item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, price } = req.body;
  try {
    const updatedItem = await Resource.findByIdAndUpdate(
      id,
      { name, quantity, price },
      { new: true, runValidators: true }
    );
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Error updating item' });
  }
});

// Route to delete an inventory item
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Resource.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting item' });
  }
});

module.exports = router;
