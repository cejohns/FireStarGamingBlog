// routes/analytics.js
const express = require('express');
const router = express.Router();
const Post     = require('../models/Post');
const Review   = require('../models/Review');
const Tutorial = require('../models/Tutorials');
const Gallery  = require('../models/Gallery');
const Video    = require('../models/Video');
const Comment  = require('../models/Comment');

router.get('/', async (req, res) => {
  try {
    // Totals
    const [
      totalPosts,
      totalReviews,
      totalTutorials,
      totalGalleries,
      totalVideos,
      totalComments
    ] = await Promise.all([
      Post.countDocuments(),
      Review.countDocuments(),
      Tutorial.countDocuments(),
      Gallery.countDocuments(),
      Video.countDocuments(),
      Comment.countDocuments()
    ]);

    // Top 5 posts by view count
    const topPosts = await Post.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views');

    res.json({
      totalPosts,
      totalReviews,
      totalTutorials,
      totalGalleries,
      totalVideos,
      totalComments,
      topPosts
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
