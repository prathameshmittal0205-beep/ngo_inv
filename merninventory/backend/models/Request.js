const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  customerName: String,
  productName: String,
  quantity: Number,
  price: Number,
});

module.exports = mongoose.model('Request', requestSchema);
