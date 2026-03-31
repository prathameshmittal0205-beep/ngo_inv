const mongoose = require('mongoose');

const seedDB = async () => {
  try {
    // 1. Connect to the DB
    await mongoose.connect('mongodb://localhost:27017/ngo_db');
    console.log("🌱 Connecting to NGO_DB for seeding...");

    // 2. Define Inline Schemas (This avoids "Model not found" errors)
    const Resource = mongoose.models.Resource || mongoose.model('Resource', new mongoose.Schema({
      name: String, category: String, quantity: Number, unit: String
    }));

    const Donor = mongoose.models.Donor || mongoose.model('Donor', new mongoose.Schema({
      name: String, contact: String, email: String
    }));

    const Request = mongoose.models.Request || mongoose.model('Request', new mongoose.Schema({
      beneficiary: String, item: String, quantity: Number, status: String, urgency: String, location: String, createdAt: { type: Date, default: Date.now }
    }));

    // 3. Clear existing data for a clean slate
    await Resource.deleteMany({});
    await Donor.deleteMany({});
    await Request.deleteMany({});

    // 4. Seed Resources (Inventory)
    const resources = [
      { name: "RICE", category: "Food", quantity: 500, unit: "kg" },
      { name: "BANDAGES", category: "Medical", quantity: 200, unit: "rolls" },
      { name: "FIRST AID KITS", category: "Medical", quantity: 50, unit: "kits" },
      { name: "WIRES", category: "Utility", quantity: 100, unit: "meters" },
      { name: "COFSIL", category: "Medical", quantity: 15, unit: "bottles" } // This will trigger the "Critical Alert"
    ];
    await Resource.insertMany(resources);

    // 5. Seed Donor
    await Donor.create({
      name: "Prathamesh Mittal",
      contact: "9876543210",
      email: "prathameshmittal0205@gmail.com"
    });

    // 6. Seed FULFILLED REQUESTS (This fixes the N/A issue)
    // We simulate that these items were consumed in the last 30 days
    const fulfilledRequests = [
      { beneficiary: "Local Shelter", item: "RICE", quantity: 50, status: "Fulfilled", urgency: "Normal", location: "Zone A" },
      { beneficiary: "City Clinic", item: "BANDAGES", quantity: 20, status: "Fulfilled", urgency: "High", location: "Zone B" },
      { beneficiary: "Rescue Team", item: "FIRST AID KITS", quantity: 10, status: "Fulfilled", urgency: "High", location: "Zone C" },
      { beneficiary: "Repair Crew", item: "WIRES", quantity: 5, status: "Fulfilled", urgency: "Normal", location: "Zone D" }
    ];
    await Request.insertMany(fulfilledRequests);

    console.log("✅ Success! Database Seeded.");
    console.log("📊 Dashboard will now show real Runway days instead of N/A.");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedDB();