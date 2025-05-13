const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Video = require('../models/Video');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../uploads/videos');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// GET /api/videos - Retrieve all videos (for admin and public)
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.status(200).json(videos);
  } catch (err) {
    console.error('❌ Error fetching videos:', err);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// GET /api/videos/:id - Retrieve one video by ID
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.status(200).json(video);
  } catch (err) {
    console.error('❌ Error fetching video detail:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/videos - Upload video & save metadata
router.post('/', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video uploaded' });
    }
    const { title, description } = req.body;
    const videoUrl = `/uploads/videos/${req.file.filename}`;
    const newVideo = new Video({ title, description, videoUrl });
    const saved = await newVideo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error uploading video:', err);
    res.status(500).json({ error: 'Failed to upload video' });
  }
});

// PUT /api/videos/approve/:id - Approve a video
router.put('/approve/:id', async (req, res) => {
  try {
    const updated = await Video.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json({ message: 'Video approved', video: updated });
  } catch (err) {
    console.error('❌ Error approving video:', err);
    res.status(500).json({ error: 'Failed to approve video' });
  }
});

// PUT /api/videos/:id - Edit video (metadata and/or file)
router.put('/:id', upload.single('video'), async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    // Replace file if a new one was uploaded
    if (req.file) {
      const oldPath = path.join(uploadDir, path.basename(video.videoUrl));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      video.videoUrl = `/uploads/videos/${req.file.filename}`;
    }
    // Update metadata
    if (req.body.title)       video.title = req.body.title;
    if (req.body.description) video.description = req.body.description;

    const updated = await video.save();
    res.json({ message: 'Video updated', video: updated });
  } catch (err) {
    console.error('❌ Error updating video:', err);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// DELETE /api/videos/:id - Delete video record and file
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    const filePath = path.join(uploadDir, path.basename(video.videoUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: 'Video deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting video:', err);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;
