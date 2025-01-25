const express = require('express');
const mongoose = require('mongoose'); // Added mongoose import
const connectDB = require('./config/db');
const subscriptionRoutes = require('./routes/subscription');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/Posts');
const analyticsRoutes = require('./routes/analytics');
const commentsRoutes = require('./routes/comments');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error('Error: MONGO_URI is not defined in the .env file');
    process.exit(1);
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5173'],
    credentials: true
}));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('Connected to MongoDB!'))
.catch(err => console.error('MongoDB connection error:', err.message));

// Routes
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Internal Server Error', 
        details: err.message 
    });
});

// Default route
app.get('/', (req, res) => {
    res.json({ message: 'Firestar Gaming API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});