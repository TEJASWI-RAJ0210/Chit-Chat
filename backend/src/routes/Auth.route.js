import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { fullName, username, email, password } = req.body;
        // normalize email for lookup
        const normalizedEmail = email ? email.toLowerCase() : email;

        // Check for existing user by email
        const existingByEmail = await User.findOne({ email: normalizedEmail });
        if (existingByEmail) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // If username provided, check for username uniqueness
        if (username) {
          const existingByUsername = await User.findOne({ username: username.toLowerCase() });
          if (existingByUsername) {
            return res.status(400).json({ message: 'User with this username already exists' });
          }
        }

        // Let mongoose pre-save hook hash the password once
        const userCreateData = {
            fullName,
            email: normalizedEmail,
            password
        };
        if (username) {userCreateData.username = username.toLowerCase();}

        const newUser = await User.create(userCreateData);
        
        res.status(201).json({ 
            message: 'User created successfully', 
            userId: newUser._id 
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
          user: {
            _id: user._id,
            email: user.email,
            username: user.username,
            fullName: user.fullName || "",
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