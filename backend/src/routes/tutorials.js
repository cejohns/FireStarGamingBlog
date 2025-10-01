const express = require("express");
const path      = require("path");
const router = express.Router();
const Tutorial = require("../models/Tutorials");
const { body, validationResult } = require("express-validator");

// 🔒 Validation middleware
const validateTutorial = [
    body("title").notEmpty().withMessage("Title is required"),
    body("author").notEmpty().withMessage("Author is required"),
    body("summary").notEmpty().withMessage("Summary is required"),
    body("content").notEmpty().withMessage("Content is required"),
    body("category").notEmpty().withMessage("Category is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];

// ✅ Admin: Get all tutorials
router.get("/", async (req, res) => {
    try {
        const tutorials = await Tutorial.find();
        res.status(200).json(tutorials);
    } catch (err) {
        console.error("❌ Failed to fetch tutorials:", err);
        res.status(500).json({ error: "Failed to fetch tutorials" });
    }
});

// ✅ Public: Get only published tutorials
router.get("/published", async (req, res) => {
    try {
        const tutorials = await Tutorial.find({ published: true });
        res.json(tutorials);
    } catch (err) {
        console.error("❌ Failed to fetch published tutorials:", err);
        res.status(500).json({ error: "Failed to fetch published tutorials" });
    }
});

// ✅ Get tutorial by ID
router.get("/:id", async (req, res) => {
    try {
         const tutorial = await Tutorial.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
        if (!tutorial) return res.status(404).json({ error: "Tutorial not found" });
        res.json(tutorial);
    } catch (err) {
        console.error("❌ Failed to fetch tutorial:", err);
        res.status(500).json({ error: "Failed to fetch tutorial" });
    }
});

// POST /api/Tuorials/:id/like
router.post('/:id/like', async (req, res) => {
  const tutorial = await Tutorial.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return post
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});

// POST /api/tutorials/:id/dislike
router.post('/:id/dislike', async (req, res) => {
  const tutorial = await Tutorial.findByIdAndUpdate(
    req.params.id,
    { $inc: { dislikes: 1 } },
    { new: true }
  );
  return tutorial
    ? res.json(post)
    : res.status(404).json({ error: 'Not found' });
});


// ✅ Create new tutorial
router.post("/", validateTutorial, async (req, res) => {
    const { title, author, summary, content, category } = req.body;
    try {
        const newTutorial = new Tutorial({ title, author, summary, content, category });
        await newTutorial.save();
        res.status(201).json({ message: "Tutorial added!", tutorial: newTutorial });
    } catch (err) {
        console.error("❌ Error adding tutorial:", err);
        res.status(500).json({ error: "Failed to add tutorial" });
    }
});

// ✅ Approve a tutorial
router.put("/approve/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findByIdAndUpdate(
            req.params.id,
            { approved: true },
            { new: true }
        );
        if (!tutorial) return res.status(404).json({ error: "Tutorial not found" });
        res.json({ message: "Tutorial approved", tutorial });
    } catch (err) {
        console.error("❌ Error approving tutorial:", err);
        res.status(500).json({ error: "Failed to approve tutorial" });
    }
});

// ✅ Update a tutorial
router.put("/:id", validateTutorial, async (req, res) => {
    const { title, author, summary, content, category } = req.body;
    try {
        const updatedTutorial = await Tutorial.findByIdAndUpdate(
            req.params.id,
            { title, author, summary, content, category },
            { new: true }
        );
        if (!updatedTutorial) return res.status(404).json({ error: "Tutorial not found" });
        res.json({ message: "Tutorial updated", tutorial: updatedTutorial });
    } catch (err) {
        console.error("❌ Error updating tutorial:", err);
        res.status(500).json({ error: "Failed to update tutorial" });
    }
});

// ✅ Delete a tutorial
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Tutorial.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Tutorial not found" });
        res.json({ message: "Tutorial deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting tutorial:", err);
        res.status(500).json({ error: "Failed to delete tutorial" });
    }
});

router.get("/view/:id", async (req, res) => {
    try {
        const tutorial = await Tutorial.findById(req.params.id); // ✅ use 'tutorial'
        if (!tutorial || !tutorial.approved) {
            return res.status(404).send("Tutorial not found or not approved");
        }

        res.sendFile(path.join(__dirname, "../public/tutorials.html"));
    } catch (err) {
        console.error("❌ Error loading tutorial:", err.message);
        res.status(500).send("Failed to load tutorial");
    }
});

module.exports = router;
