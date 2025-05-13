const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description:{type: String, required: true},
    approved: { type: Boolean, default: false }, // Admin approval system
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Video", VideoSchema);
