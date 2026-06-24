const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const componentsDir = path.join(srcDir, 'components');

const fileRenames = {
  'AddInventoryItem.jsx': 'AddResource.jsx',
  'ManageInventories.jsx': 'ManageResources.jsx',
  'AddSupplier.jsx': 'AddProvider.jsx',
  'ManageSuppliers.jsx': 'ManageProviders.jsx',
  'EditSupplier.jsx': 'EditProvider.jsx',
  'AddOrder.jsx': 'AddRequest.jsx',
  'ManageOrders.jsx': 'ManageRequests.jsx',
  'ViewOrders.jsx': 'ViewRequests.jsx'
};

// 1. Rename files
for (const [oldName, newName] of Object.entries(fileRenames)) {
  const oldPath = path.join(componentsDir, oldName);
  const newPath = path.join(componentsDir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
  }
}

// 2. Replace contents
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js') || file.endsWith('.css')) {
      results.push(file);
    }
  });
  return results;
}

const allFiles = walk(srcDir);

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace API endpoints
  content = content.replace(/\/api\/inventory/g, '/api/resources');
  content = content.replace(/\/api\/suppliers/g, '/api/providers');
  content = content.replace(/\/api\/orders/g, '/api/requests');

  // Replace Router links & paths
  content = content.replace(/inventory\/add1/g, 'resources/manage'); // Fix the specific bug
  content = content.replace(/inventory\/add/g, 'resources/add');
  content = content.replace(/inventory\//g, 'resources/');
  
  content = content.replace(/suppliers\/add/g, 'providers/add');
  content = content.replace(/suppliers\/manage/g, 'providers/manage');
  content = content.replace(/suppliers\/edit/g, 'providers/edit');
  content = content.replace(/suppliers\//g, 'providers/');

  content = content.replace(/orders\/add/g, 'requests/add');
  content = content.replace(/orders\/view/g, 'requests/view');
  content = content.replace(/orders\/manage/g, 'requests/manage');
  content = content.replace(/orders\//g, 'requests/');

  // Replace component imports and tags
  content = content.replace(/AddInventoryItem/g, 'AddResource');
  content = content.replace(/ManageInventories/g, 'ManageResources');
  content = content.replace(/AddSupplier/g, 'AddProvider');
  content = content.replace(/ManageSuppliers/g, 'ManageProviders');
  content = content.replace(/EditSupplier/g, 'EditProvider');
  content = content.replace(/AddOrder/g, 'AddRequest');
  content = content.replace(/ManageOrders/g, 'ManageRequests');
  content = content.replace(/ViewOrders/g, 'ViewRequests');

  // Replace visible text
  content = content.replace(/Inventory Items?/g, 'Resources');
  content = content.replace(/Add Inventory/g, 'Add Resource');
  content = content.replace(/Manage Inventory/g, 'Manage Resources');
  
  // Only replace Supplier and Order at word boundaries to avoid things like "border"
  content = content.replace(/\bSuppliers?\b/gi, match => {
    if (match === 'Supplier') return 'Provider';
    if (match === 'Suppliers') return 'Providers';
    if (match === 'supplier') return 'provider';
    if (match === 'suppliers') return 'providers';
    return match;
  });

  content = content.replace(/\bOrders?\b/gi, match => {
    if (match === 'Order') return 'Request';
    if (match === 'Orders') return 'Requests';
    if (match === 'order') return 'request';
    if (match === 'orders') return 'requests';
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});

console.log("Frontend refactoring completed.");
