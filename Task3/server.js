const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const User = require("./classes/User");
const authMiddleware = require("./middleware/auth");

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Home route
app.get("/", (req, res) => {
  res.send("Login System API is running");
});

// Register route
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = new User(username, password);
    await user.register();

    return res.send("User registered successfully");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("Username and password are required");
    }

    const user = new User(username, password);
    await user.login();

    req.session.user = username;

    return res.send("Login successful");
  } catch (error) {
    return res.status(400).send(error.message);
  }
});

// Protected dashboard route
app.get("/dashboard", authMiddleware, (req, res) => {
  res.send(`Welcome ${req.session.user}`);
});

// Logout route
app.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).send("Logout failed");
    }

    return res.send("Logout successful");
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});