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
const https = require('https');
const fs = require('fs');
const uploadRoutes = require("./routes/uploads");


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

// Enable CORS with specific options
app.use(
    cors({
        origin: 'http://127.0.0.1:5500', // Replace with the origin of your frontend
        credentials: true, // Allow cookies and credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    })
);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow your frontend origin
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allowed HTTP methods
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers
    next();
});

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5500');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});


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
app.use("/api/upload", uploadRoutes);
app.use("/uploads", express.static("uploads")); // Serve uploaded files

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

// Read SSL certificate and key
const httpsOptions = {
    key: fs.readFileSync('server.key'), // Private key file path
    cert: fs.readFileSync('server.cert'), // Certificate file path
    secureProtocol: 'TLSv1_2_method',
};



// Start HTTPS server
https.createServer(httpsOptions, app).listen(3001, () => {
    console.log('HTTPS server running on port 3001');
});

