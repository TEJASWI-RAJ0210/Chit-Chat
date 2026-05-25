import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, fullName, email, password } = req.body;
        // normalize email for lookup
        const normalizedEmail = email ? email.toLowerCase() : email;

        // build check query: only include username check when provided
        const orConditions = [{ email: normalizedEmail }];
        if (username) orConditions.push({ username });

        const existingUser = await User.findOne({ $or: orConditions });

        if (existingUser) {
          return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // If no username provided, derive one from the email prefix and ensure uniqueness
        let finalUsername = username && username.trim() ? username.trim() : null;
        if (!finalUsername) {
          const base = (normalizedEmail && normalizedEmail.split('@')[0]) || `user${Date.now().toString().slice(-6)}`;
          let candidate = base.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
          let suffix = 0;
          // ensure uniqueness
          while (await User.findOne({ username: candidate })) {
            suffix++;
            candidate = `${base}${suffix}`.replace(/[^a-zA-Z0-9._]/g, '').toLowerCase();
          }
          finalUsername = candidate;
        }

        // Let mongoose pre-save hook hash the password once
        const newUser = await User.create({ 
          username: finalUsername, 
          fullName,
          email: normalizedEmail, 
          password
        });
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7h' });
        
        res.status(201).json({ 
            message: 'User created successfully', 
            userId: newUser._id,
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'SignUp Failed' });
    }
});

// Login Route
router.post('/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7h' });
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            userId: user._id,
            user: {
              _id: user._id,
              fullName: user.fullName || null,
              username: user.username || null,
              email: user.email || null
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login Failed' });
    }
});

// Check if username is available
router.post("/check-username", async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findOne({ username: username.toLowerCase() });

    if (user) {
      return res.status(200).json({ available: false, message: "Username already taken" });
    }

    return res.status(200).json({ available: true, message: "Username is available" });
  } catch (error) {
    return res.status(500).json({ available: false, message: "Server error" });
  }
});

// Update username (after signup)
router.post("/set-username", async (req, res) => {
  const { userId, username } = req.body;

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // Update username
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username: username.toLowerCase() },
      { new: true }
    );

    res.status(200).json({ message: "Username updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Unable to update username", error });
  }
});


export default router;

// Temporary admin endpoint to backfill missing fullName for existing users.
// Protected by BACKFILL_SECRET env var. Remove or disable after use.
router.post('/backfill-fullname', async (req, res) => {
  try {
    const secret = req.body?.secret || req.query?.secret || req.headers['x-backfill-secret'];
    if (!process.env.BACKFILL_SECRET || secret !== process.env.BACKFILL_SECRET) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const users = await User.find({
      $or: [ { fullName: { $exists: false } }, { fullName: null }, { fullName: '' } ]
    }).lean();

    let updated = 0;
    for (const u of users) {
      let newName = null;
      if (u.username) newName = u.username;
      else if (u.email) newName = (u.email || '').split('@')[0];
      else newName = `user-${String(u._id).slice(-6)}`;

      newName = String(newName)
        .split(/[^A-Za-z0-9]+/)
        .filter(Boolean)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      await User.findByIdAndUpdate(u._id, { fullName: newName });
      updated++;
    }

    return res.json({ message: 'Backfill complete', usersFound: users.length, updated });
  } catch (err) {
    console.error('Backfill error:', err);
    return res.status(500).json({ message: err.message || 'Backfill failed' });
  }
});

// // Debug: validate token and show decoded payload (tries both secrets)
// router.get('/validate-token', async (req, res) => {
//   const auth = req.headers.authorization?.split(' ')[1];
//   if (!auth) return res.status(400).json({ message: 'No token provided' });

//   const jwt = await import('jsonwebtoken');
//   const secrets = [process.env.JWT_SECRET, process.env.ACCESS_TOKEN_SECRET];
//   let decoded = null;
//   let errors = [];

//   for (const s of secrets) {
//     if (!s) continue;
//     try {
//       decoded = jwt.verify(auth, s);
//       return res.json({ ok: true, secretUsed: !!s, decoded });
//     } catch (err) {
//       errors.push(err.message);
//     }
//   }

//   return res.status(401).json({ ok: false, errors });
// });