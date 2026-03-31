const mongoose = require('mongoose');
const requestSchema = new mongoose.Schema({
  requesterName: { type: String, required: true },
  itemRequested: { type: String, required: true },
  quantity: { type: Number, required: true },
  urgency: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Fulfilled'], default: 'Pending' }
}, { timestamps: true });
module.exports = mongoose.model('Request', requestSchema);