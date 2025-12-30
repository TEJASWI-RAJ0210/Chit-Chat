import { generateResponse } from "../services/ai.service.js";

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // For now, stateless, so we just send the single message as user role
        const messages = [{ role: "user", content: message }];
        const reply = await generateResponse(messages);

        res.json({ reply });
    } catch (error) {
        console.error("AI Controller Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
};

