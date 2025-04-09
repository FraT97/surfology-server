const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const saltRounds = 10;

// SIGNUP - returns authToken
router.post("/signup", async (req, res, next) => {
  const { email, password, firstName } = req.body;

  if (!email || !password || !firstName) {
    return res.status(400).json({ message: "Provide email, password and name" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Provide a valid email address." });
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const createdUser = await User.create({ email, password: hashedPassword, firstName });

    const { _id, role } = createdUser;
    const payload = { _id, email, firstName, role };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return res.status(201).json({ authToken });
  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
});

// LOGIN - returns authToken
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Provide email and password." });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(401).json({ message: "User not found." });
    }

    const passwordCorrect = bcrypt.compareSync(password, foundUser.password);
    if (!passwordCorrect) {
      return res.status(401).json({ message: "Unable to authenticate the user" });
    }

    const { _id, firstName, role } = foundUser;
    const payload = { _id, email, firstName, role };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    return res.status(200).json({ authToken });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

// VERIFY TOKEN
router.get("/verify", isAuthenticated, (req, res, next) => {
  res.status(200).json({ message: "User is authenticated", user: req.payload });
});

module.exports = router;
