const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    console.error("Error: MONGO_URI is not defined in the .env file");
    process.exit(1);
}

const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Middleware
app.use(express.json());
//app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

// Enable CORS
app.use(
    cors({
        origin: "http://127.0.0.1:5500", // Replace with your frontend origin
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Connect to MongoDB
mongoose
    .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB!"))
    .catch((err) => console.error("MongoDB connection error:", err.message));

// Routes
app.use("/api/subscription", require("./routes/subscription"));
app.use("/api/users", require("./routes/users"));
app.use("/api/posts", require("./routes/Posts"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 // Serve uploaded files
app.use("/api/videos", require("./routes/videos"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/tutorials", require("./routes/tutorials"));
app.use("/api/galleries", require("./routes/gallery"));

// Default route
app.get("/", (req, res) => {
    res.json({ message: "Firestar Gaming API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// HTTPS server setup
const httpsOptions = {
    key: fs.readFileSync("new-key.key"), // Ensure the path is correct
    cert: fs.readFileSync("new-cert.crt"), // Ensure the path is correct
};

/*https.createServer(httpsOptions, app).listen(PORT, () => {
    console.log(`HTTPS server running on port ${PORT}`);
});*/

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});