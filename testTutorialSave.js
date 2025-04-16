const mongoose = require("mongoose");
const Tutorial = require("./models/Tutorials");


mongoose.connect("mongodb://localhost:27017/firestarblog", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const newTutorial = new Tutorial({
    title: "Test Tutorial",
    author: "Cory Johnson",
    summary: "Testing manual insert",
    content: "This is a test content for tutorial",
    category: "Game Development"
});

newTutorial.save()
    .then(() => {
        console.log("✅ Test tutorial added!");
        mongoose.disconnect();
    })
    .catch((err) => {
        console.error("❌ Failed to save tutorial:", err);
        mongoose.disconnect();
    });
