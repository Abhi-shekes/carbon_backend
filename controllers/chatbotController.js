import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// Store chat sessions in memory
const chatSessions = new Map();

export const chatBot = async (req, res) => {
  const { sessionId = 2, message } = req.body;

  if (!sessionId || !message) {
    return res
      .status(400)
      .json({ error: "sessionId and message are required" });
  }

  try {
    let chatSession = chatSessions.get(sessionId);

    if (!chatSession) {
      // Create a new chat session if it doesn't exist
      chatSession = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {
                text: "You are an AI assistant that answers only sustainability-related questions. If the user asks something unrelated, politely steer the conversation back to sustainability.",
              },
            ],
          },
        ],
      });
      chatSessions.set(sessionId, chatSession);
    }

    // Send the user message and get the response
    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Error fetching AI response:", error);
    res.status(500).json({
      error: "Failed to fetch AI response",
      details: error.message || "Unknown error",
    });
  }
};
