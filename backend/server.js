const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "ngo_connect_ultra_secret_2026"; 

// --- 1. DB CONNECTION ---
mongoose.connect('mongodb://localhost:27017/ngo_db')
    .then(() => console.log("🚀 NGO ENGINE: Connected to ngo_db"))
    .catch(err => console.error("❌ DB Error:", err));

// --- 2. MODELS ---
const Donor = mongoose.model('Donor', new mongoose.Schema({
    name: String,
    email: String
}));

const Donation = mongoose.model('Donation', new mongoose.Schema({
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    item: String,
    quantity: Number,
    unit: String,
    amount: Number,
    createdAt: { type: Date, default: Date.now }
}));

const Resource = mongoose.model('Resource', new mongoose.Schema({
    name: String,
    category: { type: String, default: 'General' },
    quantity: Number,
    unit: String,
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' }
}));

const Request = mongoose.model('Request', new mongoose.Schema({
    beneficiary: String, 
    item: String, 
    quantity: Number, 
    location: String,
    status: { type: String, default: 'Pending' }, 
    createdAt: { type: Date, default: Date.now }
}));

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'volunteer' }
}));

// --- 3. AUTH MIDDLEWARE ---
const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No Token" });
    try { 
        req.user = jwt.verify(token, JWT_SECRET); 
        next(); 
    } catch (err) { 
        res.status(400).json({ message: "Invalid Session" }); 
    }
};

// --- 4. THE ROUTES ---

// AUTH
app.post('/api/auth/login', async (req, res) => {
    const user = await User.findOne({ username: req.body.username });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) return res.status(400).json({ message: "Invalid Credentials" });
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, role: user.role, username: user.username });
});

// DONORS
app.get('/api/donors', authenticate, async (req, res) => res.json(await Donor.find().sort({ name: 1 })));

app.post('/api/donors', authenticate, async (req, res) => {
    try {
        const donor = await new Donor(req.body).save();
        res.status(201).json(donor);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// DONATIONS
app.get('/api/donations', authenticate, async (req, res) => {
    const data = await Donation.find().populate('donor').sort({ createdAt: -1 });
    res.json(data);
});

app.post('/api/donations', authenticate, async (req, res) => {
    try {
        const { donor, item, quantity, unit, amount } = req.body;
        const donation = await new Donation({ donor, item, quantity, unit, amount }).save();
        
        let resObj = await Resource.findOne({ name: { $regex: new RegExp("^" + item.trim() + "$", "i") } });
        if (resObj) {
            resObj.quantity += Number(quantity);
        } else {
            resObj = new Resource({ name: item, quantity, unit, donor, category: 'General' });
        }
        await resObj.save();
        res.status(201).json(donation);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// RESOURCES
app.get('/api/resources', authenticate, async (req, res) => res.json(await Resource.find().populate('donor', 'name')));

app.post('/api/resources', authenticate, async (req, res) => {
    try {
        const resource = await new Resource(req.body).save();
        res.status(201).json(resource);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// --- DELETE DONATION & ADJUST STOCK ---
// --- DELETE DONATION ROUTE ---
app.delete('/api/donations/:id', authenticate, async (req, res) => {
    try {
        const donationId = req.params.id;

        // 1. Find the donation first so we know what item/quantity to deduct from stock
        const donation = await Donation.findById(donationId);
        if (!donation) {
            return res.status(404).json({ message: "Donation record not found" });
        }

        // 2. Find the corresponding resource in inventory
        const resource = await Resource.findOne({ 
            name: { $regex: new RegExp("^" + donation.item.trim() + "$", "i") } 
        });

        // 3. Subtract the quantity from the resource stock
        if (resource) {
            resource.quantity = Math.max(0, resource.quantity - donation.quantity);
            await resource.save();
        }

        // 4. Delete the donation record itself
        await Donation.findByIdAndDelete(donationId);

        res.json({ message: "Donation deleted and inventory updated." });
    } catch (err) {
        console.error("❌ Delete Error:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// REQUESTS
app.get('/api/requests', authenticate, async (req, res) => {
    res.json(await Request.find().sort({ createdAt: -1 }));
});

app.post('/api/requests', authenticate, async (req, res) => {
    try {
        const { beneficiary, item, quantity, location } = req.body;
        const newRequest = new Request({
            beneficiary, item, quantity: Number(quantity), location, status: 'Pending'
        });
        await newRequest.save();
        res.status(201).json(newRequest);
    } catch (err) {
        res.status(400).json({ message: "Creation Failed", error: err.message });
    }
});

app.patch('/api/requests/:id/fulfill', authenticate, async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);
        if (!request) return res.status(404).json({ message: "Request ID not found" });

        const searchItem = request.item.trim().toLowerCase();
        const neededQty = Number(request.quantity);

        const allResources = await Resource.find({});
        const resource = allResources.find(r => r.name.trim().toLowerCase() === searchItem);

        if (!resource) return res.status(400).json({ message: `Vault Mismatch: No resource named "${request.item}" found.` });

        const currentStock = Number(resource.quantity);
        if (currentStock < neededQty) return res.status(400).json({ message: "Insufficient Stock" });

        resource.quantity = currentStock - neededQty;
        await resource.save();
        
        request.status = 'Fulfilled';
        await request.save();

        res.json({ message: "Fulfillment Successful!", remainingStock: resource.quantity });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});

// --- ANALYTICS ROUTES ---

app.get('/api/stats', authenticate, async (req, res) => {
    try {
        const donors = await Donor.countDocuments();
        const resources = await Resource.find();
        const totalStock = resources.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
        const moneyResult = await Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
        const fulfilled = await Request.countDocuments({ status: 'Fulfilled' });
        res.json({ 
            totalDonors: donors, totalResources: resources.length, totalStock, 
            totalFunds: moneyResult[0]?.total || 0, fulfilledCount: fulfilled 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// THIS ROUTE WAS MISSING (The 404 Fix)
app.get('/api/stats/top-donors', authenticate, async (req, res) => {
    try {
        const topDonors = await Donation.aggregate([
            { $group: { _id: "$donor", totalAmount: { $sum: "$amount" }, donationCount: { $sum: 1 } } },
            { $sort: { totalAmount: -1 } },
            { $limit: 5 },
            { $lookup: { from: "donors", localField: "_id", foreignField: "_id", as: "donorInfo" } },
            { $unwind: "$donorInfo" },
            { $project: { name: "$donorInfo.name", totalAmount: 1, donationCount: 1 } }
        ]);
        res.json(topDonors);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/distribution', authenticate, async (req, res) => {
    try {
        const dist = await Resource.aggregate([
            { $group: { _id: "$name", value: { $sum: "$quantity" } } },
            { $project: { name: "$_id", value: 1, _id: 0 } }
        ]);
        res.json(dist);
    } catch (err) { res.status(500).json({ message: "Error" }); }
});

app.listen(5000, () => console.log(`🚀 NGO ENGINE: Running on port 5000`));