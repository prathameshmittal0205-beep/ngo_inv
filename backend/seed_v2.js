const mongoose = require('mongoose');
const Donor = require('./models/Donor');
const Resource = require('./models/Resource');
const Donation = require('./models/Donation');

const MONGO_URI = 'mongodb://localhost:27017/ngo_db';

const seedData = async () => {
  await mongoose.connect(MONGO_URI);
  
  // 1. Clear existing data to start fresh
  await Donor.deleteMany({});
  await Resource.deleteMany({});
  await Donation.deleteMany({});

  // 2. Create Professional Donors
  const donors = await Donor.insertMany([
    { name: "Aditya Verma", email: "aditya@vmail.com", type: "Individual", totalContributed: 5000 },
    { name: "Tata Trusts", email: "contact@tata.org", type: "Corporate", totalContributed: 50000 },
    { name: "Sneha Kapoor", email: "sneha.k@outlook.com", type: "Individual", totalContributed: 2000 },
    { name: "Reliance Foundation", email: "csr@reliance.com", type: "Corporate", totalContributed: 100000 },
    { name: "Dr. Ishaan Sharma", email: "ishaan@hospital.com", type: "Individual", totalContributed: 15000 }
  ]);

  // 3. Create Sample Resources
  const resources = await Resource.insertMany([
    { name: "Basmati Rice", category: "Food", quantity: 500, unit: "kg" },
    { name: "Paracetamol", category: "Medicine", quantity: 1200, unit: "tabs" },
    { name: "Cooking Oil", category: "Food", quantity: 100, unit: "ltr" },
    { name: "Blankets", category: "Clothing", quantity: 45, unit: "pcs" }
  ]);

  // 4. Create Links (Relational Data)
  await Donation.insertMany([
    { donor: donors[0]._id, resourceType: "Rice", amount: 50, unit: "kg" },
    { donor: donors[1]._id, resourceType: "Cash", amount: 50000, unit: "INR" },
    { donor: donors[4]._id, resourceType: "Medicine", amount: 200, unit: "tabs" }
  ]);

  console.log("✅ Database Seeded with 5 Donors, 4 Resources, and 3 Donations!");
  process.exit();
};

seedData();