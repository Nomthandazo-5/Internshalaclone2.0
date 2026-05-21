import express from 'express';
import Post from '../Model/Post.js';
import User from '../Model/User.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
router.get('/stats/:id', async (req, res) => {
  const userId = req.params.id;

  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(400).json({ message: "Invalid User ID" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const postsToday = await Post.countDocuments({
      user: req.params.id,
      createdAt: { $gte: startOfDay }
    });

    res.json({
      friendCount: user.friends ? user.friends.length : 0,
      postsToday: postsToday
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

router.post('/create', upload.single('media'), async (req, res) => {
  const { caption, user: userId } = req.body;

  if (!userId || userId === "undefined" || userId === "null") {
    return res.status(401).json({ message: "User ID is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friendCount = user.friends ? user.friends.length : 0;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const todayCount = await Post.countDocuments({
      user: userId,
      createdAt: { $gte: startOfDay }
    });

    let limit = 1;
    if (friendCount >= 2) limit = 2;
    if (friendCount > 10) limit = Infinity;

    if (todayCount >= limit) {
      return res.status(403).json({
        message: `Daily limit reached. Max posts: ${limit}`
      });
    }

    const newPost = new Post({
      user: userId,
      content: caption,
      mediaUrl: req.file ? `/uploads/${req.file.filename}` : null,
      mediaType: req.file
        ? (req.file.mimetype.includes('video') ? 'video' : 'image')
        : null
    });

    await newPost.save();
    const populatedPost = await Post.findById(newPost._id).populate('user', 'name role profileImage');

    res.json(populatedPost);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error creating post" });
  }
});

router.get('/all', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name role profileImage')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feed" });
  }
});

router.put('/like/:id', async (req, res) => {
  const { userId } = req.body;

  try {
    const post = await Post.findById(req.params.id);
    post.likes.push(userId);
    await post.save();

    res.json({ likes: post.likes.length });

  } catch (err) {
    res.status(500).json({ message: "Error liking post" });
  }
});

export default router;