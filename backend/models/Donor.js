const mongoose = require('mongoose');
const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  type: { type: String, enum: ['Individual', 'Corporate'], default: 'Individual' },
  totalContributed: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model('Donor', donorSchema);