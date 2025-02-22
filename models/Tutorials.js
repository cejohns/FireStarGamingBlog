const mongoose = require("mongoose");

const TutorialSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: {type: String, required:true},
    summary: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    approved: { type: Boolean, default: false }, // Admin approval system
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Tutorial", TutorialSchema);
