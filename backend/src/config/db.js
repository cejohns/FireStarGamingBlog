const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Access MONGO_URI from environment variables
        const uri = process.env.MONGO_URI;

        if (!uri) {
            throw new Error("MONGO_URI is not defined in environment variables.");
        }

        await mongoose.connect(uri, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
        });
        
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;

