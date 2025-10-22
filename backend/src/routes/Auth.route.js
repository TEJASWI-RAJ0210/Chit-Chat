import express from 'express';
import router from 'express-promise-router';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const JWT_SECRET = process.env.JWT_SECRET ;

// Signup Page
router.post('/signup', async (req, res) => {
    try {
        const { username, email,password } = req.body;
        const existingUser = await User.findOne({ $or: [ { email }, { username } ] });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const User = await User.create({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User created successfully', userId: User._id });
    } catch (error) {
        res.status(500).json({ message: 'SignUp Failed' });
        
    }
    router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const User = await User.findOne({ email });
        if (!User) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, User.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: User._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: 'Login Failed' });
    }
    })
})

module.exports = router;