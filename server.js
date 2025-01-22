const express = require('express');
const connectDB = require('./config/db');
const subscriptionRoutes = require('./routes/subscription');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const analyticsRoutes = require('./routes/analytics');
const commentsRoutes = require('./routes/comments');
const cors = require('cors');
const dotenv = require('dotenv');
const https = require('https');
const fs = require('fs');
const httpsRedirect = require('./middlewares/httpsRedirect');

const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const HTTP_PORT = process.env.PORT || 3000;
const HTTPS_PORT = process.env.HTTPS_PORT || 3001;

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();




// Middleware
app.use(express.json()); // Parses JSON payloads
app.use(cors()); // Enables CORS
if (NODE_ENV === 'development') {
    app.use(httpsRedirect); // Redirect HTTP to HTTPS
}

// Routes
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Firestar Gaming API is running...');
});

// HTTPS setup (for development)
if (NODE_ENV === 'development') {
    const httpsOptions = {
        key: fs.readFileSync('server.key'), // Private Key
        cert: fs.readFileSync('server.cert'), // Self-Signed Certificate
    };

    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS server running in development mode on port ${HTTPS_PORT}`);
    });
} else {
    // HTTP server for production (or fallback)
    app.listen(HTTP_PORT, () => {
        console.log(`Server running in ${NODE_ENV} mode on port ${HTTP_PORT}`);
    });
}
