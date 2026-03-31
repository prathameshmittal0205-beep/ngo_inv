const mongoose = require('mongoose');
const Donor = require('./models/Donor');
const Resource = require('./models/Resource');
const Donation = require('./models/Donation');
const Request = require('./models/Request');

const MONGO_URI = 'mongodb://localhost:27017/ngo_db';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  await Promise.all([Donor.deleteMany({}), Resource.deleteMany({}), Donation.deleteMany({}), Request.deleteMany({})]);

  // 1. Create Donors
  const d1 = await new Donor({ name: "Prathamesh Mittal", email: "pm@vit.edu", type: "Individual" }).save();
  const d2 = await new Donor({ name: "Global CSR Corp", email: "charity@corp.com", type: "Corporate" }).save();

  // 2. Create Resources
  await Resource.insertMany([
    { name: "Rice", category: "Food", quantity: 100, unit: "kg" },
    { name: "Bandages", category: "Medicine", quantity: 500, unit: "pcs" }
  ]);

  // 3. Create Linked Donations
  await Donation.insertMany([
    { donor: d1._id, item: "Rice", quantity: 50, unit: "kg", amount: 2500 },
    { donor: d2._id, item: "Medicine", quantity: 100, unit: "pcs", amount: 15000 }
  ]);

  // 4. Create Requests
  await Request.insertMany([
    { requesterName: "Local Orphanage", itemRequested: "Rice", quantity: 10, urgency: "High", status: "Pending" }
  ]);

  console.log("✅ Database Fully Seeded with Relationships!");
  process.exit();
};

seed();