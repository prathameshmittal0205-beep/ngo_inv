require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const User = require('./models/User'); // Ensure this path is correct
const providerRoutes = require('./routes/providerRoutes'); // Ensure this path is correct
const resourceRoutes = require('./routes/resourceRoutes');
const requestRoutes = require('./routes/requestRoutes');
const salesRoutes = require('./routes/salesRoutes');
const reportsRoutes = require('./routes/reportsRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const verifyToken = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.log('MongoDB connection error:', err);
  });


// Routes
app.use('/api/providers', providerRoutes);

app.use('/api/resources', resourceRoutes);
app.use('/api/requests', requestRoutes);

app.use('/api/sales', salesRoutes);

app.use('/api/reports', reportsRoutes);

// Routes
app.use('/api/employees', employeeRoutes);


// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    return res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    return res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});
app.post('/api/logout', (req, res) => {
  // Clear the token on the server-side (if using server-side sessions)
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
