const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  category: { 
    type: String, 
    required: true, 
    enum: ['Food', 'Medicine', 'Clothing', 'Electronics', 'General'], 
    default: 'General' 
  },
  quantity: { type: Number, default: 0 },
  unit: { type: String, default: 'units' },
  // LINK TO THE DONOR MODEL
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);