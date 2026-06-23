const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // <-- ADD THIS LINE
const User = require('../models/User');

const router = express.Router();

// POST ROUTE: /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // 1. Check if email is already taken
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email already exists' });
    }

    // 2. Hash the password (10 rounds of salt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Assemble the new user object
    user = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    // 4. Save to MongoDB Atlas
    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});
// POST ROUTE: /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Does this email exist in Mongo?
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    // 2. Check password against the Bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    // 3. Print the VIP Wristband (The JWT payload)
    const payload = {
      userId: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({
      message: 'Logged in successfully!',
      token: token,
      user: { id: user._id, name: user.name, role: user.role }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during login' });
  }
});
module.exports = router;