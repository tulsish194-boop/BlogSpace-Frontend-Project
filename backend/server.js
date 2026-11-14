const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./db");
const User = require("./models/User");
const Blog = require("./models/Blog");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log("REQUEST RECEIVED:", req.method, req.url);
  next();
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Access token required."
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token."
      });
    }

    req.user = user;
    next();
  });
}


// ========================================
// HOME ROUTE
// ========================================
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the BlogSpace Backend API!",
    database: "MongoDB"
  });
});

// ========================================
// READ: GET ALL BLOG POSTS
// ========================================
// ========================================
// READ: GET BLOGS OF LOGGED-IN USER
// ========================================
console.log("MY-BLOGS ROUTE REGISTERED");
app.get("/api/my-blogs", authenticateToken, async (req, res) => {
  try {
    const blogs = await Blog.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json(blogs);
  } catch (error) {
    console.error("Get my blogs error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve your blog posts."
    });
  }
});
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("Get blogs error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve blog posts."
    });
  }
});

// ========================================
// READ: GET ONE BLOG POST
// ========================================
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid blog ID."
      });
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({
        message: "Blog post not found."
      });
    }

    res.json(blog);
  } catch (error) {
    console.error("Get blog details error:", error.message);

    res.status(500).json({
      message: "Failed to retrieve blog details."
    });
  }
});

// ========================================
// CREATE: CREATE A BLOG POST
// ========================================
app.post("/api/blogs", authenticateToken, async (req, res) => {
  try {
    const { title, content, author, category, excerpt } = req.body;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }

    const blog = await Blog.create({
      title: title.trim(),
      content: content.trim(),
      user: req.user.id,
      author:
        typeof author === "string" && author.trim()
          ? author.trim()
          : "BlogSpace User",
      category:
        typeof category === "string" && category.trim()
          ? category.trim()
          : "General",
      excerpt:
        typeof excerpt === "string"
          ? excerpt.trim()
          : ""
    });

    res.status(201).json({
      message: "Blog post created successfully!",
      blog
    });
  } catch (error) {
    console.error("Create blog error:", error.message);

    res.status(500).json({
      message: "Failed to create blog post."
    });
  }
});

// ========================================
// UPDATE: UPDATE A BLOG POST
// ========================================
app.put("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author, category, excerpt } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid blog ID."
      });
    }

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof content !== "string" ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title and content are required."
      });
    }
   const updatedBlog = await Blog.findOneAndUpdate(
  {
    _id: id,
    user: req.user.id
  },
    
      {
        title: title.trim(),
        content: content.trim(),
        author:
          typeof author === "string" && author.trim()
            ? author.trim()
            : "BlogSpace User",
        category:
          typeof category === "string" && category.trim()
            ? category.trim()
            : "General",
        excerpt:
          typeof excerpt === "string"
            ? excerpt.trim()
            : ""
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBlog) {
      return res.status(404).json({
        message: "Blog post not found."
      });
    }

    res.json({
      message: "Blog post updated successfully!",
      blog: updatedBlog
    });
  } catch (error) {
    console.error("Update blog error:", error.message);

    res.status(500).json({
      message: "Failed to update blog post."
    });
  }
});

// ========================================
// DELETE: DELETE A BLOG POST
// ========================================
app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: "Invalid blog ID."
      });
    }

    const deletedBlog = await Blog.findOneAndDelete({
  _id: id,
  user: req.user.id
});

    if (!deletedBlog) {
      return res.status(404).json({
        message: "Blog post not found."
      });
    }

    res.json({
      message: "Blog post deleted successfully!",
      blog: deletedBlog
    });
  } catch (error) {
    console.error("Delete blog error:", error.message);

    res.status(500).json({
      message: "Failed to delete blog post."
    });
  }
});

// ========================================
// REGISTER A USER
// ========================================
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Username, email, and password are required."
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must contain at least 8 characters."
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Registration successful!",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    console.error("Registration error:", error.message);

    res.status(500).json({
      message: "Registration failed."
    });
  }
});

// ========================================
// LOGIN A USER
// ========================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

const token = jwt.sign(
  {
    id: user._id,
    username: user.username,
    email: user.email
  },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

res.json({
  message: "Login successful!",
  token,
  user: {
    id: user._id,
    username: user.username,
    email: user.email
  }
});

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed."
    });
  }
});

// ========================================
// START SERVER AFTER DATABASE CONNECTION
// ========================================
async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        "BlogSpace backend is running at http://localhost:" + PORT
      );
    });
  } catch (error) {
    console.error("Could not start the server:", error.message);
    process.exit(1);
  }
}

startServer();