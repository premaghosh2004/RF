const express = require('express');
const { query, body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', optionalAuth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('city').optional().trim(),
  query('state').optional().trim(),
  query('minRent').optional().isFloat({ min: 0 }),
  query('maxRent').optional().isFloat({ min: 0 }),
  query('gender').optional().isIn(['Male','Female','Any']),
  query('foodPreference').optional().isIn(['Vegetarian','Non-Vegetarian','Any']),
  query('duration').optional().isIn(['1-3 months','3-6 months','6-12 months','12+ months','Flexible']),
  query('sortBy').optional().isIn(['compatibility','rent','age','recent'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid query parameters', errors: errors.array() });
    const { page = 1, limit = 20, city, state, minRent, maxRent, gender, foodPreference, duration, sortBy = 'compatibility' } = req.query;

    const filter = { isActive: true, ...(req.user?._id ? { _id: { $ne: req.user._id } } : {}) };
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (state) filter['location.state'] = { $regex: state, $options: 'i' };

    if (minRent || maxRent) {
      const clauses = [];
      if (minRent) clauses.push({ 'preferences.rentRange.max': { $gte: parseInt(minRent) } }, { 'roomDetails.rent': { $gte: parseInt(minRent) } });
      if (maxRent) clauses.push({ 'preferences.rentRange.min': { $lte: parseInt(maxRent) } }, { 'roomDetails.rent': { $lte: parseInt(maxRent) } });
      filter.$or = clauses;
    }

    if (gender && gender !== 'Any') filter.$or = [ { 'preferences.genderPreference': 'Any' }, { 'preferences.genderPreference': gender }, { gender } ];
    if (foodPreference && foodPreference !== 'Any') filter.$or = [ { 'preferences.foodPreference': 'Any' }, { 'preferences.foodPreference': foodPreference } ];
    if (duration && duration !== 'Flexible') filter.$or = [ { 'preferences.duration': 'Flexible' }, { 'preferences.duration': duration } ];

    const skip = (parseInt(page) - 1) * parseInt(limit);
    let profiles = await User.find(filter).select('-password -email -phone -savedProfiles').skip(skip).limit(parseInt(limit)).lean();

    if (req.user) {
      profiles = profiles.map(p => ({ ...p, compatibility: req.user.calculateCompatibility(p), isSaved: req.user.savedProfiles.includes(p._id) }));
    } else {
      profiles = profiles.map(p => ({ ...p, compatibility: Math.floor(Math.random() * (95 - 70) + 70), isSaved: false }));
    }

    switch (sortBy) {
      case 'rent': profiles.sort((a,b)=> (a.roomDetails?.rent || a.preferences?.rentRange?.max || 0) - (b.roomDetails?.rent || b.preferences?.rentRange?.max || 0)); break;
      case 'age': profiles.sort((a,b)=> a.age - b.age); break;
      case 'recent': profiles.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt)); break;
      default: profiles.sort((a,b)=> b.compatibility - a.compatibility);
    }

    const total = await User.countDocuments(filter);
    res.json({ success: true, data: { profiles, pagination: { currentPage: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)), totalResults: total, hasNext: parseInt(page) * parseInt(limit) < total, hasPrev: parseInt(page) > 1 } } });
  } catch (error) { console.error('Get profiles error:', error); res.status(500).json({ success: false, message: 'Server error while fetching profiles' }); }
});

router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const profile = await User.findOne({ _id: req.params.id, isActive: true }).select('-password -email -phone -savedProfiles');
    if (!profile) return res.status(404).json({ success: false, message: 'Profile not found' });
    await User.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });
    const obj = profile.toObject();
    if (req.user && req.user._id.toString() !== req.params.id) { obj.compatibility = req.user.calculateCompatibility(profile); obj.isSaved = req.user.savedProfiles.includes(profile._id); }
    else { obj.compatibility = null; obj.isSaved = false; }
    res.json({ success: true, data: { profile: obj } });
  } catch (error) { console.error('Get profile error:', error); res.status(500).json({ success: false, message: 'Server error while fetching profile' }); }
});

router.post('/:id/save', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const exists = await User.findOne({ _id: id, isActive: true });
    if (!exists) return res.status(404).json({ success: false, message: 'Profile not found' });
    if (req.user._id.toString() === id) return res.status(400).json({ success: false, message: 'Cannot save your own profile' });

    const user = await User.findById(req.user._id);
    const isSaved = user.savedProfiles.includes(id);
    if (isSaved) { await User.findByIdAndUpdate(req.user._id, { $pull: { savedProfiles: id } }); return res.json({ success: true, message: 'Profile removed from saved list', data: { isSaved: false } }); }
    else { await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedProfiles: id } }); return res.json({ success: true, message: 'Profile added to saved list', data: { isSaved: true } }); }
  } catch (error) { console.error('Save profile error:', error); res.status(500).json({ success: false, message: 'Server error while saving profile' }); }
});

router.get('/saved/list', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; const skip = (parseInt(page) - 1) * parseInt(limit);
    const user = await User.findById(req.user._id).populate({ path: 'savedProfiles', select: '-password -email -phone -savedProfiles', match: { isActive: true }, options: { skip, limit: parseInt(limit) } });
    const savedProfiles = user.savedProfiles.map(p => ({ ...p.toObject(), compatibility: req.user.calculateCompatibility(p), isSaved: true }));
    const totalSaved = await User.findById(req.user._id).populate({ path: 'savedProfiles', match: { isActive: true }, select: '_id' });
    const total = totalSaved.savedProfiles.length; const totalPages = Math.ceil(total / parseInt(limit));
    res.json({ success: true, data: { profiles: savedProfiles, pagination: { currentPage: parseInt(page), totalPages, totalResults: total, hasNext: parseInt(page) < totalPages, hasPrev: parseInt(page) > 1 } } });
  } catch (error) { console.error('Get saved profiles error:', error); res.status(500).json({ success: false, message: 'Server error while fetching saved profiles' }); }
});

router.get('/search/suggestions', async (req, res) => {
  try {
    const { q, type = 'city' } = req.query;
    if (!q || q.length < 2) return res.json({ success: true, data: { suggestions: [] } });
    const suggestions = type === 'state'
      ? await User.distinct('location.state', { 'location.state': { $regex: q, $options: 'i' }, isActive: true })
      : await User.distinct('location.city', { 'location.city': { $regex: q, $options: 'i' }, isActive: true });
    res.json({ success: true, data: { suggestions: suggestions.slice(0, 10) } });
  } catch (error) { console.error('Get search suggestions error:', error); res.status(500).json({ success: false, message: 'Server error while fetching suggestions' }); }
});

module.exports = router;