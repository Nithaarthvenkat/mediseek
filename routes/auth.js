const express = require('express');
const router  = express.Router();
const User    = require('../models/User');

// ── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    // Check for duplicate username or email
    const existingUser  = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Username already taken. Please choose another.' });
    }
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Create user — password auto-hashed by pre-save hook in User.js
    const user = await User.create({ firstName, lastName, username, email, password });

    // Start session
    req.session.userId   = user._id;
    req.session.username = user.username;

    console.log(`✅  New user registered: ${user.username} (${user.email})`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        name:     user.fullName,
        joinedAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ success: false, message: `That ${field} is already in use.` });
    }
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Find user matching BOTH username and email
    const user = await User.findOne({ username, email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Incorrect username, email, or password. Please try again.' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect username, email, or password. Please try again.' });
    }

    // Append login history entry
    user.loginHistory.push({ loginAt: new Date(), ipAddress: req.ip });
    await user.save({ validateBeforeSave: false });

    // Start session
    req.session.userId   = user._id;
    req.session.username = user.username;

    console.log(`✅  User logged in: ${user.username}`);

    res.json({
      success: true,
      message: 'Logged in successfully!',
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        name:     user.fullName,
        joinedAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not log out.' });
    res.clearCookie('connect.sid');
    res.json({ success: true, message: 'Logged out successfully.' });
  });
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
// Called on page load to silently restore session (auto-login after refresh)
router.get('/me', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  try {
    const user = await User.findById(req.session.userId).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({
      success: true,
      user: {
        id:       user._id,
        username: user.username,
        email:    user.email,
        name:     user.fullName,
        joinedAt: user.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
router.put('/profile', async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated.' });
  }
  try {
    const { firstName, lastName } = req.body;
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { firstName, lastName },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, message: 'Profile updated!', user: { name: user.fullName } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not update profile.' });
  }
});

module.exports = router;
