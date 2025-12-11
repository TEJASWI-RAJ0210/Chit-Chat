import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

// Get User Profile Route
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "fullName email username contactNumber bio profilePic"
    );

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  }
});


// Update user profile route
router.put("/update/:userId", async (req, res) => {
  try {
    const { fullName, email, contact, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        fullName,
        email,
        contactNumber,
        bio,
      },
      { new: true }
    ).select("fullName email username contact bio");

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating profile", error });
  }
});

export default router;
