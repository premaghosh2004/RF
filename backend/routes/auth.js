const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, generateToken } = require('../middleware/auth');
const router = express.Router();

const validateRegistration = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().isLength({ min: 2, max: 50 }),
  body('age').isInt({ min: 18, max: 65 }),
  body('gender').isIn(['Male', 'Female', 'Other']),
  body('location.city').notEmpty(),
  body('location.state').notEmpty()
];

const validateLogin = [ body('email').isEmail().normalizeEmail(), body('password').notEmpty() ];

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });

    const { email, password, name, age, gender, location, phone, bio } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User with this email already exists' });

    const user = new User({ email, password, name, age, gender, location, phone, bio });
    await user.save();
    const token = generateToken(user._id);

    res.status(201).json({ success: true, message: 'User registered successfully', data: { token, user: user.getPublicProfile() } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });
    if (!user.isActive) return res.status(401).json({ success: false, message: 'Account is deactivated' });

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    user.lastActive = new Date();
    await user.save();
    const token = generateToken(user._id);

    res.json({ success: true, message: 'Login successful', data: { token, user: user.getPublicProfile() } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

router.get('/me', authenticateToken, async (req, res) => {
  res.json({ success: true, data: { user: req.user.getPublicProfile() } });
});

router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const allowed = ['name','age','phone','bio','location','preferences','roomDetails','traits','interests','avatar'];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    if (!Object.keys(updates).length) return res.status(400).json({ success: false, message: 'No valid fields to update' });

    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true, runValidators: true });
    res.json({ success: true, message: 'Profile updated successfully', data: { user: user.getPublicProfile() } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
});

router.post('/change-password', authenticateToken, [ body('currentPassword').notEmpty(), body('newPassword').isLength({ min: 6 }) ], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    const ok = await user.comparePassword(currentPassword);
    if (!ok) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    user.password = newPassword; await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, message: 'Server error during password change' });
  }
});

router.delete('/account', authenticateToken, async (req, res) => {
  try { await User.findByIdAndUpdate(req.user._id, { isActive: false }); res.json({ success: true, message: 'Account deactivated successfully' }); }
  catch (error) { console.error('Deactivate account error:', error); res.status(500).json({ success: false, message: 'Server error during account deactivation' }); }
});

module.exports = router;