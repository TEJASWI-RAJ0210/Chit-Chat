import express from "express";
import { chatWithAI } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/chat", chatWithAI);

<<<<<<< HEAD
=======

>>>>>>> c87fe41b76793837656014758f2e52d615d56cca
export default router;
