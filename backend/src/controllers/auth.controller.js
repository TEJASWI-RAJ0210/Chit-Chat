import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { OAuth2Client } from "google-auth-library";

const googleClient = new OAuth2Client();

export const googleLogin = async (req, res) => {
  try {
    const { accessToken } = req.body;
    if (!accessToken) {
      return res.status(400).json({ message: "Google access token is required" });
    }

    // Validate the token with Google, then obtain account details from Google
    // itself. Never trust identity fields supplied by the browser.
    await googleClient.getTokenInfo(accessToken);
    const profileResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profileResponse.ok) {
      return res.status(401).json({ message: "Invalid Google access token" });
    }
    const profile = await profileResponse.json();
    const email = (profile.email || "").toLowerCase();
    if (!email || profile.verified_email !== true) {
      return res.status(401).json({ message: "Google account email is not verified" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        fullName: profile.name,
        email,
        profilePic: profile.picture,
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
