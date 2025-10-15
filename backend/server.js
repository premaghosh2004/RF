const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profiles');
const userRoutes = require('./routes/users');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();
app.use(helmet());
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', message: 'RF API is running', timestamp: new Date().toISOString() });
});

app.use('*', (_req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
