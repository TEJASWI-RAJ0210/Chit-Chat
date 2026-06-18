import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const googleLogin = async (req, res) => {
  try {
    const { name, email, picture } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: name,
        email,
        profilePic: picture,
        password: "google-user",
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      userId: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName || null,
        username: user.username || null,
        email: user.email || null,
      },
    });

  } catch (error) {
    console.error("Google Login Error:", error);

    return res.status(500).json({
      message: "Google Login Failed",
    });
  }
};