const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Route to fetch analytics
// routes/analytics.js
router.get('/', async (req, res) => {
  try {
    const [ totalPosts, totalReviews, totalTutorials,
            totalGalleries, totalVideos, totalComments ] =
      await Promise.all([
        Post.countDocuments(),
        Review.countDocuments(),
        Tutorial.countDocuments(),
        Gallery.countDocuments(),
        Video.countDocuments(),
        Comment.countDocuments()
      ]);

    const topPosts = await Post.find().sort({ views: -1 }).limit(5);
    const topReviews = await Review.find().sort({ views: -1 }).limit(5);
    // …same for tutorials, galleries, videos…

    res.json({
      totalPosts, totalReviews, totalTutorials, totalGalleries, totalVideos,
      totalComments,
      topPosts, topReviews, /* topTutorials, topGalleries, topVideos */
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});


module.exports = router;
