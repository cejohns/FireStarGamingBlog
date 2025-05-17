const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const { verifyToken, verifyAdmin } = require('./routes/middleware/auth');

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

// ── Content Security Policy ────────────────────────────────────
// allow self, data-URIs, inline styles, and Google Fonts
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src  'self'",
      "connect-src 'self'",
      "img-src     'self' data:",
      "font-src    'self' https://fonts.gstatic.com",
      "style-src   'self' 'unsafe-inline' https://fonts.googleapis.com",
      "style-src-elem 'self' https://fonts.googleapis.com"
    ].join("; ")
  );
  next();
});

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
// Middleware
app.use(express.json());
//app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));

// Enable CORS
// in server.js, replace your existing cors() middleware with:

app.use(cors({
  origin: [
    "http://localhost:3000",    // when you load via Express
    "http://127.0.0.1:5500"     // when you load via Live Server
  ],
  credentials: true,
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type","Authorization"],
}));


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
app.use("/api/posts", require("./routes/posts"));
app.use("/api/videos", require("./routes/videos"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/tutorials", require("./routes/tutorials"));
app.use("/api/galleries", require("./routes/gallery"));
app.use("/api/comments", require("./routes/comments"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/upload", require("./routes/uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
 // Serve uploaded files
 // 1️⃣ Serve everything in /public as static
app.use(express.static(path.join(__dirname, "public")));

// 🔐 Protect the admin panel
app.get('/admin-panel.html',
  verifyToken,
  verifyAdmin,
  (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-panel.html'));
  }
);

  // Serve an approved post
app.get("/posts/view/:id", async (req, res) => {
  const Post = require("./models/Post");
  const post = await Post.findById(req.params.id);
  if (!post || !post.approved) {
    return res.status(404).send("Post not found or not approved");
  }
  res.sendFile(path.join(__dirname, "public/post.html"));
});

// Serve an approved review
app.get("/reviews/view/:id", async (req, res) => {
  const Review = require("./models/Review");
  const review = await Review.findById(req.params.id);
  if (!review || !review.approved) {
    return res.status(404).send("Review not found or not approved");
  }
  res.sendFile(path.join(__dirname, "public/review.html"));
});

// Serve an approved video
app.get("/videos/view/:id", async (req, res) => {
  const Video = require("./models/Video");
  const video = await Video.findById(req.params.id);
  if (!video || !video.approved) {
    return res.status(404).send("Video not found or not approved");
  }
  res.sendFile(path.join(__dirname, "public/video.html"));
});
app.get("/galleries/view/:id", async (req, res) => {
    const Gallery = require("./models/Gallery");
    const gallery = await Gallery.findById(req.params.id);
  
    if (!gallery || !gallery.approved) {
      return res.status(404).send("Gallery not found or not approved");
    }
  
    res.sendFile(path.join(__dirname, "public/gallery.html"));
  });

  app.get('/tutorials/view/:id', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'tutorials.html');
    console.log('→ serving:', filePath);
    res.sendFile(filePath, err => {
      if (err) {
        console.error('sendFile error:', err);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
      }
    });
  });



  
  /*app.listen(3000, () => console.log("✅ Server on http://localhost:3000"));
// Default route
app.get("/", (req, res) => {
    res.json({ message: "Firestar Gaming API is running" });
});*/

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