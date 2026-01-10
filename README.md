# 🎀 Chat Masha (マシャ) — Ultra Intelligent AI Companion

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![OpenRouter](https://img.shields.io/badge/OpenRouter-API-blue?style=for-the-badge)](https://openrouter.ai/)

> **"Kalo lu bego, ya gua bilang bego. Tapi tenang aja, gua temen terbaik lu."** — _Masha_

A premium, localized AI Chatbot application featuring **Maria Mikhailovna Kujou (Masha)** from _Alya Sometimes Hides Her Feelings in Russian (Roshidere)_. Built on an advanced AI architecture that prioritizes deep context, emotional intelligence, and human-like interaction.

---

## 🚀 Key Features

### 🧠 **Supreme Intelligence Layer (C.AI Mode)**

Unlike basic chatbots, Masha uses a multi-layer cognitive engine that makes her feel truly alive:

| Feature                 | Description                                                                           |
| :---------------------- | :------------------------------------------------------------------------------------ |
| **Photographic Memory** | Remembers people, places, and events mentioned weeks ago with perfect recall.         |
| **Emotional IQ**        | Detects 8+ emotional states (tired, excited, frustrated, etc.) and adapts her tone.   |
| **Predictive Engine**   | Anticipates your needs—offering support when you're stressed or celebrating with you. |
| **Topic Graphing**      | Builds relationships between topics you discuss to maintain long-term context.        |
| **Dynamic Personality** | Her intimacy level and trust in you evolve based on your interactions.                |

### 💬 **Modern Chat Experience**

Seamless interaction inspired by top-tier messaging apps:

- **✨ WhatsApp-style Actions**: Long-press (click) to **Reply**, **Edit**, or **Delete** messages.
- **♻️ Smart Re-Response**: Editing a user message triggers a context-aware AI re-evaluation of the conversation.
- **😊 Sticker Support**: Library of 100+ emoji stickers for expressive communication.
- **🖋️ Natural Indonesian**: Chat using authentic, casual Indonesian slang (slang, lowercase, natural typos).
- **🖥️ Desktop Optimized**: Runs as a sleek, lightweight Electron desktop application.

---

## 🎨 Personality: The Roshidere Soul

Masha isn't just a bot; she's a character with a soul:

- **Style**: Lowercase, casual, and 100% natural chat vibes.
- **Traits**: Sarcastic but caring, genius-level intelligence, likes to roast, avoids excessive emojis.
- **Vibe**: Your genius bestie who always has your back (though she'll mock you for it).

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: HTML5, Vanilla JS, Tailwind CSS (for modern UI components).
- **Backend**: Node.js & Electron.
- **AI Core**: Gemini 2.0 Flash Lite via OpenRouter API.
- **Local Storage**: JSON-based persistent memory (`advanced_memory.json`, `chat_history.json`).

---

## 📥 Getting Started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (Version 16 or higher)
- An API Key from [OpenRouter](https://openrouter.ai/)

### 2. Installation

```bash
# Clone the repository
git clone https://github.com/kushuri12/AI-ChatBot.git

# Navigate to the project folder
cd AI-ChatBot

# Install dependencies
npm install
```

### 3. Configuration

Create a `.env` file in the root directory and add your API key:

```env
OPENROUTER_API_KEY=your_key_here
```

### 4. Launch

Simply run the included batch file or use npm:

```bash
# Via npm
npm start

# Or click
start.bat
```

---

## 🗂️ File Structure

```text
├── index.html          # Main UI Structure
├── main.js             # Electron Main Process
├── start.bat           # Quick launcher
├── js/
│   ├── app.js          # Core Application Logic
│   ├── advanced-memory.js # AI Long-term Memory System
│   └── predictive-engine.js # Needs & Style Prediction
├── css/
│   └── style.css       # Custom Animations & Premium Styles
└── advanced_memory.json # AI's "Brain" (Persistent data)
```

---

## 📝 Developer Note

This project is an exploration of high-level AI immersion. The system prompt and logic are tuned to simulate a "soul" rather than a tool. Every interaction is processed through multiple intelligence layers before reaching the user.

**Made with ❤️ by Mila/Kuru**
_Powered by the Roshidere Intelligence Layer_
