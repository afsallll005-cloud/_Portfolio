const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

// Route files
const projectRoutes = require('./routes/projectRoutes');
const skillRoutes = require('./routes/skillRoutes');
const contactRoutes = require('./routes/contactRoutes');
const heroRoutes = require('./routes/heroRoutes');
const aboutRoutes = require('./routes/aboutRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Enable CORS for all incoming origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware to ensure DB connection before processing API requests
app.use(async (req, res, next) => {
  // Allow root and health check endpoints without blocking for DB
  if (req.path === '/' || req.path === '/api' || req.path === '/api/health') {
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error in request:', error.message);
    return res.status(500).json({
      error: 'Database connection failed',
      message: 'Failed to connect to MongoDB. Make sure MONGODB_URI is set in Vercel and MongoDB Atlas Network Access allows 0.0.0.0/0.',
      details: error.message,
    });
  }
});

// Root & Health check routes
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API is running...',
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api', (req, res) => {
  res.json({
    message: 'Portfolio API is running...',
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Routes - Support both /api/* and /* prefixes for flexibility
app.use('/api/projects', projectRoutes);
app.use('/projects', projectRoutes);

app.use('/api/skills', skillRoutes);
app.use('/skills', skillRoutes);

app.use('/api/contacts', contactRoutes);
app.use('/contacts', contactRoutes);

app.use('/api/hero', heroRoutes);
app.use('/hero', heroRoutes);

app.use('/api/about', aboutRoutes);
app.use('/about', aboutRoutes);

// Only start listening when run directly via node / nodemon, not when required by serverless
if (require.main === module) {
  connectDB().catch((err) => console.error('Initial DB connection error:', err.message));
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;

