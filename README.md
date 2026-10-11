# 🤖 OJ AI - Smart Web Chatbot

A modern, responsive, and customizable AI Chatbot widget powered by Google Gemini and Express.js, styled with modern gradients, smooth animations, and multilingual support (Sinhala & English).

---

## ✨ Features

- **⚡ Fast AI Responses:** Powered by Google Gemini with low latency.
- **🇱🇰 Sinhala & English Support:** Capable of natural, polite, and fluent conversations in both Sinhala and English.
- **🎨 Modern & Responsive UI:**
  - Floating launcher bubble with animated ripple pulse.
  - Smooth glassmorphism accents and soft shadows.
  - Custom scrollbar and typing indicator animation.
  - Mobile-ready layout that adapts seamlessly to phones and desktops.
- **💡 Smart Suggestion Chips:** Clickable prompt starters for rapid queries.
- **🔒 Secure API Key Management:** Backend keeps the API key hidden from the client browser.
- **🛡️ Error Handling:** Graceful user-friendly feedback if the server or API key is not configured.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey) (Free)

### 2. Installation
Clone the repository:
```bash
git clone https://github.com/ojantharinga-dotcom/chat-bot-oj.git
cd chat-bot-oj
```

Install dependencies:
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy `.env.example`):
```bash
cp .env.example .env
```

Open `.env` and add your Gemini API Key:
```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
PORT=5000
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Run the Chatbot
Start the server:
```bash
npm start
```

Visit the application in your browser:
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 📁 Project Structure

```
my-chatbot/
├── .env.example       # Sample environment configuration
├── .gitignore          # Git ignore rules (node_modules, .env)
├── index.html          # Main HTML structure with chat widget
├── style.css           # Modern CSS styles and animations
├── script.js           # Frontend logic and API integration
├── server.js           # Express.js backend connecting to Gemini SDK
└── package.json        # Node.js project manifest
```

---

## 📄 License
ISC License. Free to use and customize for your own projects!
