const mongoose = require("mongoose");
const Gallery = require("./models/Gallery"); // Adjust the path to your Gallery model

// MongoDB connection URI
const MONGO_URI = "mongodb://127.0.0.1:27017/your_database_name";


// Sample data to insert
const galleryData = [
    {
        title: "Gallery Item 1",
        imageUrl: "https://example.com/image1.jpg",
    },
    {
        title: "Gallery Item 2",
        imageUrl: "https://example.com/image2.jpg",
    },
    {
        title: "Gallery Item 3",
        imageUrl: "https://example.com/image3.jpg",
    },
];

// Connect to MongoDB
mongoose
    .connect(MONGO_URI) // Removed deprecated options
    .then(() => {
        console.log("Connected to MongoDB");
        return Gallery.insertMany(galleryData);
    })
    .then(() => {
        console.log("Data inserted successfully");
    })
    .catch((err) => {
        console.error("Error seeding data:", err);
    })
    .finally(() => {
        mongoose.connection.close(); // Ensure connection is closed after operation
    });
