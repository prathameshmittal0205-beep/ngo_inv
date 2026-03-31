const Donation = require('../models/Donation');
const Resource = require('../models/Resource');
const Request = require('../models/Request');
const User = require('../models/User');

// 1. Get Dashboard Stats (Total counts)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const totalDonations = await Donation.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const activeVolunteers = await User.countDocuments({ role: 'Volunteer' });

    res.status(200).json({
      resources: totalResources,
      donations: totalDonations[0]?.total || 0,
      requests: pendingRequests,
      volunteers: activeVolunteers
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Resource Category Distribution (For Pie Chart)
exports.getResourceDistribution = async (req, res) => {
  try {
    const distribution = await Resource.aggregate([
      { $group: { _id: "$category", count: { $sum: "$quantity" } } }
    ]);
    res.status(200).json(distribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Volunteer Leaderboard (Employee Performance)
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.find({ role: 'Volunteer' })
      .sort({ tasksCompleted: -1 })
      .limit(5);
    res.status(200).json(leaderboard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};