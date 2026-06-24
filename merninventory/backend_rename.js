const fs = require('fs');
const path = require('path');

// 1. Rename Backend Files
const backendModels = path.join(__dirname, 'backend', 'models');
const backendRoutes = path.join(__dirname, 'backend', 'routes');

if (fs.existsSync(path.join(backendModels, 'InventoryItem.js'))) {
  fs.renameSync(path.join(backendModels, 'InventoryItem.js'), path.join(backendModels, 'Resource.js'));
}
if (fs.existsSync(path.join(backendModels, 'Supplier.js'))) {
  fs.renameSync(path.join(backendModels, 'Supplier.js'), path.join(backendModels, 'Provider.js'));
}

if (fs.existsSync(path.join(backendRoutes, 'inventoryRoutes.js'))) {
  fs.renameSync(path.join(backendRoutes, 'inventoryRoutes.js'), path.join(backendRoutes, 'resourceRoutes.js'));
}
if (fs.existsSync(path.join(backendRoutes, 'supplierRoutes.js'))) {
  fs.renameSync(path.join(backendRoutes, 'supplierRoutes.js'), path.join(backendRoutes, 'providerRoutes.js'));
}

// 2. Create backend/models/Request.js
const requestModelCode = `const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  quantity: Number,
  price: Number,
});

module.exports = mongoose.model('Request', requestSchema);
`;
fs.writeFileSync(path.join(backendModels, 'Request.js'), requestModelCode);

// 3. Create backend/routes/requestRoutes.js
const requestRoutesCode = `const express = require('express');
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
`;
fs.writeFileSync(path.join(backendRoutes, 'requestRoutes.js'), requestRoutesCode);

// 4. Update backend/server.js
let serverCode = fs.readFileSync(path.join(__dirname, 'backend', 'server.js'), 'utf8');

// Remove Order Schema
serverCode = serverCode.replace(/\/\/ Order Schema[\s\S]*?(?=\/\/ API to handle order creation)/, '');
// Remove Order Routes
serverCode = serverCode.replace(/\/\/ API to handle order creation[\s\S]*?(?=app\.listen\(PORT)/, '');

// Update imports
serverCode = serverCode.replace(/const supplierRoutes = require\('\.\/routes\/supplierRoutes'\);/, "const providerRoutes = require('./routes/providerRoutes');");
serverCode = serverCode.replace(/const inventoryRoutes = require\('\.\/routes\/inventoryRoutes'\);/, "const resourceRoutes = require('./routes/resourceRoutes');");
// Add Request Route import
serverCode = serverCode.replace(/const salesRoutes = require\('\.\/routes\/salesRoutes'\);/, "const requestRoutes = require('./routes/requestRoutes');\nconst salesRoutes = require('./routes/salesRoutes');");

// Update route registrations
serverCode = serverCode.replace(/app\.use\('\/api\/suppliers', supplierRoutes\);/, "app.use('/api/providers', providerRoutes);");
serverCode = serverCode.replace(/app\.use\('\/api\/inventory', inventoryRoutes\);/, "app.use('/api/resources', resourceRoutes);\napp.use('/api/requests', requestRoutes);");

fs.writeFileSync(path.join(__dirname, 'backend', 'server.js'), serverCode);

console.log("Backend refactoring completed.");
