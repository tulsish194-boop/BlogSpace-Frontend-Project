const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Temporary blog storage
let blogs = [
  {
    id: 1,
    title: "My First Blog",
    content: "Welcome to my first BlogSpace post!",
    author: "BlogSpace User"
  }
];
let users = [];
// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the BlogSpace Backend API!"
  });
});

// API to get all blogs
app.get("/api/blogs", (req, res) => {
  res.json(blogs);
});
// API to create a new blog post
app.post("/api/blogs", (req, res) => {
  const { title, content, author } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      message: "Title and content are required."
    });
  }

  const newBlog = {
    id: Date.now(),
    title: title,
    content: content,
    author: author || "BlogSpace User"
  };

  blogs.push(newBlog);

  res.status(201).json({
    message: "Blog post created successfully!",
    blog: newBlog
  });
});
app.post("/api/register", (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required."
    });
  }

  const existingUser = users.find(
    (user) => user.email === email
  );

  if (existingUser) {
    return res.status(409).json({
      message: "An account with this email already exists."
    });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password
  };

  users.push(newUser);

  res.status(201).json({
    message: "Registration successful!",
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email
    }
  });
});
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required."
    });
  }

  const user = users.find(
    (user) =>
      user.email === email &&
      user.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password."
    });
  }

  res.json({
    message: "Login successful!",
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`BlogSpace backend is running at http://localhost:${PORT}`);
});