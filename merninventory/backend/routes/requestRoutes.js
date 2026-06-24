const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const verifyToken = require('../middleware/auth');

router.use(verifyToken);

router.post('/', async (req, res) => {
  const { customerName, productName, quantity, price } = req.body;
  try {
    const newRequest = new Request({ customerName, productName, quantity, price });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create request' });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (request) {
      request.customerName = req.body.customerName || request.customerName;
      request.productName = req.body.productName || request.productName;
      request.quantity = req.body.quantity || request.quantity;
      request.price = req.body.price || request.price;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Request not found' });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
