
const express = require("express");
const router = express.Router();

const Blog = require("../models/Blog");

// CREATE BLOG
router.post("/", async (req, res) => {
  try {
    const newBlog = new Blog(req.body);

    const savedBlog = await newBlog.save();

    res.status(201).json({
      message: "Blog created successfully",
      blog: savedBlog
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating blog",
      error: error.message
    });
  }
});

module.exports = router;
