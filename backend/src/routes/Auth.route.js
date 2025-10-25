import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Signup Route
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // normalize email for lookup
        const normalizedEmail = email ? email.toLowerCase() : email;
        const existingUser = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }

        // Let mongoose pre-save hook hash the password once
        const newUser = await User.create({ 
            username, 
            email: normalizedEmail, 
            password
        });
        
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
            token 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login Failed' });
    }
});

export default router;