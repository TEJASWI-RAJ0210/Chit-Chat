import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import { analyzeSentiment } from "../services/sentiment.service.js";

const router = express.Router();

router.post("/chat", protect, chatWithAI);
router.post("/sentiment", protect, (req, res) => {
  const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
  if (!message) return res.status(400).json({ message: "Message is required" });
  return res.json(analyzeSentiment(message));
});

export default router;
