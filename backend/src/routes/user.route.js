import { Router } from 'express';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/Cloudinary.js";

const upload = multer({ dest: "uploads/" });



const router = Router();



// Get User Profile Route
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "fullName email username contactNumber bio profilePic"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send safe values even if fields are missing
    res.status(200).json({
      fullName: user.fullName || "",
      email: user.email || "",
      username: user.username || "",
      contactNumber: user.contactNumber || "",
      bio: user.bio || "",
      profilePic: user.profilePic || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});



// Update user profile route
router.put("/update/:userId", async (req, res) => {
  try {
    const { fullName, email, contactNumber, bio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        fullName: fullName || "",
        email: email || "",
        contactNumber: contactNumber || "",
        bio: bio || "",
      },
      { new: true }
    ).select("fullName email username contactNumber bio profilePic");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating profile" });
  }
});

router.put("/upload-pic/:userId", upload.single("profilePic"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profilePic: result.secure_url },
      { new: true }
    ).select("fullName email username contactNumber bio profilePic");

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile picture" });
  }
});



export default router;
