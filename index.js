//Task 1: Project Initialization

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Task 2: Setup Express Server

app.get("/", (req, res) => {
  res.send("Blog backend server running");
});

// Task 4: MongoDB Integration

(async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
})();

// Blog Schema (Task 4)

const blogSchema = new mongoose.Schema({
  title: String,
  description: String,
});

const Blog = mongoose.model("Blog", blogSchema);

// User Schema (Task 5)

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// Authentication Middleware

function auth(req, res, next) {
  const authhe = req.headers.authorization;
  if (!authhe) return res.status(401).json({ message: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// Task 3: Blog CRUD Routes

app.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/blogs", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newblog = new Blog({ title, description });
    await newblog.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/blogs/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const upblog = await Blog.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.json({ message: "Blog updated successfully", blog: upblog });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Blog.findByIdAndDelete(id);
    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Task 5: Basic User Authentication

app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user1 = await User.findOne({ username });
    if (user1) return res.status(400).json({ message: "User already exist" });

    const change = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: change });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ message: "Invalid username or password" });

    const valpass = await bcrypt.compare(password, user.password);
    if (!valpass)
      return res.status(400).json({ message: "Invalid username or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
});
