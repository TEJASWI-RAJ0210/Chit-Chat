import { Router } from 'express';
import User from '../models/user.model.js';

const router = Router();

// GET /api/user/:userId
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "fullName email username contactNumber bio profilePic lastSeen"
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      _id:           user._id,
      fullName:      user.fullName      || "",
      email:         user.email         || "",
      username:      user.username      || "",
      contactNumber: user.contactNumber || "",
      bio:           user.bio           || "",
      profilePic:    user.profilePic    || "",
      lastSeen:      user.lastSeen      || null,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

// PUT /api/user/update/:userId
// ✅ Now accepts profilePic URL and saves it
router.put("/update/:userId", async (req, res) => {
  try {
    const { fullName, email, contactNumber, bio, profilePic } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        fullName:      fullName      || "",
        email:         email         || "",
        contactNumber: contactNumber || "",
        bio:           bio           || "",
        // ✅ Only update profilePic if a new URL was provided
        ...(profilePic && { profilePic }),
      },
      { new: true }
    ).select("fullName email username contactNumber bio profilePic");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

export default router;