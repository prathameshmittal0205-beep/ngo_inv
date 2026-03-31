const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(express.json());
app.use(cors());

// Use Environment Variable for Secret or a fallback for local dev
const JWT_SECRET = process.env.JWT_SECRET || "ngo_connect_ultra_secret_2026"; 

// --- 1. CLOUD DB CONNECTION ---
// Updated to use your Atlas string via Environment Variables
const atlasURI = process.env.MONGODB_URI || "mongodb+srv://praty:ngo123password@ngo-engine.mcj92vg.mongodb.net/ngo_db?retryWrites=true&w=majority&appName=NGO-Engine";

mongoose.connect(atlasURI)
    .then(() => console.log("🚀 CLOUD ENGINE: Connected to MongoDB Atlas"))
    .catch(err => {
        console.error("❌ Atlas Connection Error:", err.message);
        process.exit(1); 
    });

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
        console.log("📥 Incoming Donation Request:", req.body);
        
        const donation = await new Donation({ donor, item, quantity, unit, amount }).save();
        
        let resObj = await Resource.findOne({ name: { $regex: new RegExp("^" + item.trim() + "$", "i") } });
        
        if (resObj) {
            resObj.quantity += Number(quantity);
        } else {
            resObj = new Resource({ name: item, quantity, unit, donor, category: 'General' });
        }
        
        await resObj.save();
        res.status(201).json(donation);
    } catch (err) { 
        console.error("❌ Donation Save Error:", err.message);
        res.status(400).json({ error: err.message }); 
    }
});

// RESOURCES
app.get('/api/resources', authenticate, async (req, res) => res.json(await Resource.find().populate('donor', 'name')));

app.post('/api/resources', authenticate, async (req, res) => {
    try {
        const resource = await new Resource(req.body).save();
        res.status(201).json(resource);
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/resources/:id', authenticate, async (req, res) => {
    try {
        const deletedResource = await Resource.findByIdAndDelete(req.params.id);
        if (!deletedResource) return res.status(404).json({ message: "Resource not found" });
        res.json({ message: "Resource successfully purged" });
    } catch (err) {
        res.status(500).json({ error: err.message });
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

// STATS & TOP DONORS
app.get('/api/stats', authenticate, async (req, res) => {
    const donors = await Donor.countDocuments();
    const resources = await Resource.find();
    const totalStock = resources.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
    const moneyResult = await Donation.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);
    const fulfilled = await Request.countDocuments({ status: 'Fulfilled' });
    res.json({ 
        totalDonors: donors, totalResources: resources.length, totalStock, 
        totalFunds: moneyResult[0]?.total || 0, fulfilledCount: fulfilled 
    });
});

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

// PORT Logic for Deployment
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 NGO ENGINE: Running on port ${PORT}`));