const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, maxlength: 1000 },
  messageType: { type: String, enum: ['text','image','file'], default: 'text' },
  readAt: { type: Date, default: null },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
  lastActivity: { type: Date, default: Date.now }
}, { timestamps: true });

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
conversationSchema.index({ participants: 1, lastActivity: -1 });

const Message = mongoose.model('Message', messageSchema);
const Conversation = mongoose.model('Conversation', conversationSchema);

router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query; const skip = (parseInt(page) - 1) * parseInt(limit);
    const conversations = await Conversation.find({ participants: req.user._id })
      .populate({ path: 'participants', select: 'name avatar location.city isActive', match: { _id: { $ne: req.user._id } } })
      .populate({ path: 'lastMessage', select: 'content sender createdAt messageType' })
      .sort({ lastActivity: -1 }).skip(skip).limit(parseInt(limit)).lean();
    const active = conversations.filter(c => c.participants.length > 0 && c.participants[0].isActive);
    res.json({ success: true, data: { conversations: active } });
  } catch (error) { console.error('Get conversations error:', error); res.status(500).json({ success: false, message: 'Server error while fetching conversations' }); }
});

router.get('/messages/:userId', authenticateToken, [ query('page').optional().isInt({ min: 1 }), query('limit').optional().isInt({ min: 1, max: 50 }) ], async (req, res) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Invalid query parameters', errors: errors.array() });
    const { userId } = req.params; const { page = 1, limit = 50 } = req.query; const skip = (parseInt(page) - 1) * parseInt(limit);
    const User = require('../models/User');
    const other = await User.findOne({ _id: userId, isActive: true }); if (!other) return res.status(404).json({ success: false, message: 'User not found or inactive' });

    const messages = await Message.find({ $or: [ { sender: req.user._id, recipient: userId }, { sender: userId, recipient: req.user._id } ], isDeleted: false })
      .populate('sender','name avatar').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).lean();
    await Message.updateMany({ sender: userId, recipient: req.user._id, readAt: null }, { readAt: new Date() });

    res.json({ success: true, data: { messages: messages.reverse(), otherUser: { _id: other._id, name: other.name, avatar: other.avatar, location: other.location } } });
  } catch (error) { console.error('Get messages error:', error); res.status(500).json({ success: false, message: 'Server error while fetching messages' }); }
});

router.post('/send', authenticateToken, [ body('recipient').isMongoId(), body('content').trim().isLength({ min: 1, max: 1000 }), body('messageType').optional().isIn(['text','image','file']) ], async (req, res) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    const { recipient, content, messageType = 'text' } = req.body;
    const User = require('../models/User');
    const r = await User.findOne({ _id: recipient, isActive: true }); if (!r) return res.status(404).json({ success: false, message: 'Recipient not found or inactive' });

    const message = new Message({ sender: req.user._id, recipient, content, messageType }); await message.save(); await message.populate('sender','name avatar');
    let conv = await Conversation.findOne({ participants: { $all: [req.user._id, recipient] } });
    if (!conv) conv = new Conversation({ participants: [req.user._id, recipient], lastMessage: message._id, lastActivity: new Date() });
    else { conv.lastMessage = message._id; conv.lastActivity = new Date(); }
    await conv.save();

    res.status(201).json({ success: true, message: 'Message sent successfully', data: { message } });
  } catch (error) { console.error('Send message error:', error); res.status(500).json({ success: false, message: 'Server error while sending message' }); }
});

router.put('/messages/:messageId/read', authenticateToken, async (req, res) => {
  try {
    const message = await Message.findOneAndUpdate({ _id: req.params.messageId, recipient: req.user._id, readAt: null }, { readAt: new Date() }, { new: true });
    if (!message) return res.status(404).json({ success: false, message: 'Message not found or already read' });
    res.json({ success: true, message: 'Message marked as read' });
  } catch (error) { console.error('Mark message read error:', error); res.status(500).json({ success: false, message: 'Server error while marking message as read' }); }
});

router.get('/unread-count', authenticateToken, async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({ recipient: req.user._id, readAt: null, isDeleted: false });
    res.json({ success: true, data: { unreadCount } });
  } catch (error) { console.error('Get unread count error:', error); res.status(500).json({ success: false, message: 'Server error while fetching unread count' }); }
});

module.exports = router;