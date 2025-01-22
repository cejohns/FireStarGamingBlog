const mongoose = require('mongoose');

const connectDB = async () => {
    try {
      mongoose.connect(MONGO_URI)
          .then(() => console.log("Connected to MongoDB"))
          .catch(err => console.error("MongoDB connection error:", err));
        console.log('MongoDB connected!');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
