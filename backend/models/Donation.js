const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Donor', 
    required: true 
  },
  item: { type: String, required: true }, // Make sure this is "item"
  quantity: { type: Number, required: true },
  unit: { type: String, default: 'kg' },
  amount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);