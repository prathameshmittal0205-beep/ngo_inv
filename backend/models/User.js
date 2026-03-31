const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { 
    type: String, 
    enum: ['Admin', 'Volunteer', 'Manager'], 
    default: 'Volunteer' 
  },
  tasksCompleted: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);