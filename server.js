import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
// Serve frontend static files from project root
app.use(express.static(__dirname));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY && 
    process.env.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE'
  );
  res.json({ 
    status: 'ok', 
    apiKeyConfigured: hasKey,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'පණිවිඩයක් ඇතුළත් කරන්න. (Message is required)' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(400).json({
        error: '⚠️ Gemini API Key එක .env file එකෙහි සකසා නැත. කරුණාකර your GEMINI_API_KEY එක .env එකට ඇතුළත් කරන්න.'
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: model,
      contents: message.trim(),
      config: {
        systemInstruction: "You are 'OJ AI', a smart, polite, and helpful personal AI assistant. Whenever someone asks your name or who you are, always state that you are OJ AI. Never mention you are Gemini unless specifically asked what underlying technology powers you. You can communicate fluently in both Sinhala and English.",
      },
    });

    const reply = response.text || 'ප්‍රතිචාරයක් නොලැබුණි. (No response received)';
    res.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    const errorMessage = error?.message || 'Something went wrong!';
    res.status(500).json({ 
      error: `OJ AI Error: ${errorMessage}` 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 OJ AI Chatbot Server is running at: http://localhost:${PORT}`);
  console.log(`🌐 Open http://localhost:${PORT} in your browser to test.`);
});