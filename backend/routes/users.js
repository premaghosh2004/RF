const express = require('express');
const { query, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/search', authenticateToken, [
  query('q').optional().trim().isLength({ min: 2 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid query parameters', errors: errors.array() });
    const { q, page = 1, limit = 10 } = req.query; if (!q) return res.json({ success: true, data: { users: [], pagination: { currentPage: parseInt(page), totalPages: 0, totalResults: 0 } } });

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const searchQuery = { $and: [ { isActive: true }, { _id: { $ne: req.user._id } }, { $or: [ { name: { $regex: q, $options: 'i' } }, { 'location.city': { $regex: q, $options: 'i' } }, { 'location.state': { $regex: q, $options: 'i' } }, { bio: { $regex: q, $options: 'i' } } ] } ] };
    const users = await User.find(searchQuery).select('name age gender location avatar bio preferences.foodPreference createdAt').skip(skip).limit(parseInt(limit)).lean();
    const total = await User.countDocuments(searchQuery); const totalPages = Math.ceil(total / parseInt(limit));
    res.json({ success: true, data: { users, pagination: { currentPage: parseInt(page), totalPages, totalResults: total, hasNext: parseInt(page) < totalPages, hasPrev: parseInt(page) > 1 } } });
  } catch (error) { console.error('Search users error:', error); res.status(500).json({ success: false, message: 'Server error while searching users' }); }
});

router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProfiles', 'name location').select('profileViews savedProfiles createdAt');
    const stats = { profileViews: user.profileViews || 0, savedProfiles: user.savedProfiles.length, memberSince: user.createdAt, savedProfilesDetails: user.savedProfiles.map(p => ({ id: p._id, name: p.name, location: `${p.location.city}, ${p.location.state}` })) };
    const monthlyViews = { labels: ['Jan','Feb','Mar','Apr','May','Jun'], data: [12,19,15,25,22,30] };
    res.json({ success: true, data: { stats, monthlyViews } });
  } catch (error) { console.error('Get user stats error:', error); res.status(500).json({ success: false, message: 'Server error while fetching user statistics' }); }
});

router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferences } = req.body; if (!preferences) return res.status(400).json({ success: false, message: 'Preferences data is required' });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { preferences } }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, message: 'Preferences updated successfully', data: { preferences: user.preferences } });
  } catch (error) { console.error('Update preferences error:', error); res.status(500).json({ success: false, message: 'Server error while updating preferences' }); }
});

router.put('/room-details', authenticateToken, async (req, res) => {
  try {
    const { roomDetails } = req.body; if (!roomDetails) return res.status(400).json({ success: false, message: 'Room details data is required' });
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { roomDetails } }, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, message: 'Room details updated successfully', data: { roomDetails: user.roomDetails } });
  } catch (error) { console.error('Update room details error:', error); res.status(500).json({ success: false, message: 'Server error while updating room details' }); }
});

module.exports = router;