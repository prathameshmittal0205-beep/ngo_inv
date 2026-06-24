const fs = require('fs');
const path = require('path');

const modelsDir = path.join(__dirname, 'backend', 'models');
const routesDir = path.join(__dirname, 'backend', 'routes');

function replaceInFile(filePath, search, replace) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(filePath, content);
  }
}

// Update Provider.js (formerly Supplier.js)
replaceInFile(path.join(modelsDir, 'Provider.js'), /const Supplier = mongoose\.model\('Supplier', supplierSchema\);/, "const Provider = mongoose.model('Provider', supplierSchema);");
replaceInFile(path.join(modelsDir, 'Provider.js'), /module\.exports = Supplier;/, "module.exports = Provider;");

// Update Resource.js (formerly InventoryItem.js)
replaceInFile(path.join(modelsDir, 'Resource.js'), /const InventoryItem = mongoose\.model\('InventoryItem', inventorySchema\);/, "const Resource = mongoose.model('Resource', inventorySchema);");
replaceInFile(path.join(modelsDir, 'Resource.js'), /module\.exports = InventoryItem;/, "module.exports = Resource;");

// Update providerRoutes.js
replaceInFile(path.join(routesDir, 'providerRoutes.js'), /const Supplier = require\('\.\.\/models\/Supplier'\);/g, "const Provider = require('../models/Provider');");
replaceInFile(path.join(routesDir, 'providerRoutes.js'), /Supplier\./g, "Provider.");

// Update resourceRoutes.js
replaceInFile(path.join(routesDir, 'resourceRoutes.js'), /const InventoryItem = require\('\.\.\/models\/InventoryItem'\);/g, "const Resource = require('../models/Resource');");
replaceInFile(path.join(routesDir, 'resourceRoutes.js'), /InventoryItem\./g, "Resource.");

console.log("Backend file contents updated.");
