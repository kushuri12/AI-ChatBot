# 💖 Chat with Masha - AI Chatbot Electron App

> Chat dengan Masha (Maria Mikhailovna Kujou dari Roshidere) - AI chatbot dengan genius-level intelligence dan WhatsApp-style stickers!

![Version](https://img.shields.io/badge/version-2.0-pink)
![Electron](https://img.shields.io/badge/Electron-Latest-blue)
![AI](https://img.shields.io/badge/AI-Gemini%202.0-purple)

## ✨ Features

### 🎨 Core Features

- **AI Chatbot Pintar** dengan personality Masha dari Roshidere
- **WhatsApp-Style Stickers** (104 stickers!)
- **Perfect Memory System** - AI inget semua obrolan
- **Emotional Intelligence** - Baca mood & context
- **Persistent Chat History** - Chat history tersimpan
- **Beautiful UI** - Glassmorphism design dengan animasi smooth

### 🧠 AI Capabilities

- ✅ **Genius-Level Intelligence** dengan perfect memory
- ✅ **Sticker Understanding** - Ngerti arti emoji/sticker
- ✅ **Context Mastery** - Callback ke obrolan sebelumnya
- ✅ **Emotional Reading** - Deteksi mood dari cara chat
- ✅ **Multi-Layer Thinking** - Understand surface, intent, & needs
- ✅ **Natural Conversations** - Chat natural kayak teman asli

### 😊 Sticker Features

- 104 emoji stickers dalam grid 4 kolom
- Modal picker dengan animasi smooth
- Auto-close saat klik di luar
- Sticker display besar di chat
- Categories: emotions, hearts, reactions, party, dll

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 atau lebih baru)
- npm atau yarn
- OpenRouter API Key (untuk akses Gemini 2.0)

### Installation

1. **Clone repository**

   ```bash
   git clone <your-repo-url>
   cd isengaja
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   # Copy .env.example ke .env
   cp .env.example .env

   # Edit .env dan tambahkan API key kamu
   # OPENROUTER_API_KEY=your-api-key-here
   ```

4. **Run aplikasi**
   ```bash
   npm start
   ```

## 🔑 Getting API Key

1. Daftar di [OpenRouter](https://openrouter.ai/)
2. Buat API key di dashboard
3. Copy key dan paste ke file `.env`

```env
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxx
```

## 📁 Project Structure

```
isengaja/
├── index.html              # Main app file (upgraded version)
├── index_upgraded.html     # Development version
├── main.js                 # Electron main process
├── package.json            # Project configuration
├── .env                    # Environment variables (not in git)
├── .env.example            # Template for .env
├── .gitignore              # Git ignore rules
├── chat_history.json       # Persistent chat storage
├── context_memory.json     # AI context & memory
├── masha.png               # Avatar image
├── UPGRADE_NOTES.md        # Detailed upgrade documentation
└── node_modules/           # Dependencies (not in git)
```

## 💡 Usage

### Basic Chat

1. Ketik pesan di input box
2. Tekan Enter atau klik tombol kirim
3. Masha akan balas dengan natural & contextual

### Send Stickers

1. Klik tombol emoji (😊) di samping input
2. Pilih sticker dari grid
3. Sticker langsung terkirim

### AI Features

- **Memory**: AI inget semua obrolan kamu
- **Context**: Reference obrolan kemarin secara natural
- **Emotions**: Kirim sticker, AI ngerti artinya
- **Smart**: AI baca mood kamu dari cara chat

## 🎯 Example Conversations

### Memory & Callback

```
[Day 1]
You: "gua lagi project backend ribet, 7 microservices"
Masha: "buset kompleks, deadline kapan"

You: "2 minggu"
Masha: "ketat juga"

[Day 2]
You: "akhirnya mulai"
Masha: "oh project backend itu? gimana"  ← REMEMBERS!
```

### Sticker Understanding

```
You: [😭 sticker]
Masha: "ada apa anjir"

You: "cape meeting 8 jam"
Masha: "gila lama banget"

You: [❤️ sticker]
Masha: "iya iya"
```

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS (Tailwind), Vanilla JavaScript
- **Desktop**: Electron
- **AI Model**: Google Gemini 2.0 Flash Lite (via OpenRouter)
- **Storage**: Local JSON files
- **Fonts**: Plus Jakarta Sans, Outfit (Google Fonts)

## 📝 Configuration

### AI Settings

Edit di `index.html` bagian `getMashaResponse()`:

```javascript
model: "google/gemini-2.0-flash-lite-001",
temperature: 0.8,      // Creativity level (0-1)
max_tokens: 200,       // Response length
top_p: 0.9            // Nucleus sampling
```

### Chat History

- Auto-saved ke `chat_history.json`
- Keeps last 100 messages
- Persistent across sessions

### Context Memory

- Saved to `context_memory.json`
- Tracks: topics, mood, events, preferences
- Used for smart callbacks

## 🎨 Customization

### Change Avatar

Replace `masha.png` dengan gambar kamu (recommended: 512x512px)

### Modify Stickers

Edit array `stickers` di `index.html`:

```javascript
const stickers = [
  "😊",
  "😍", // Add your emojis here
];
```

### Change Colors

Edit CSS variables di `index.html`:

```css
:root {
  --primary: #ff85a2; /* Main color */
  --primary-hover: #ff6b8e; /* Hover color */
  --bg-gradient: linear-gradient(135deg, #fff5f7 0%, #fee2e8 100%);
}
```

## 🐛 Troubleshooting

### API Key Error

- Pastikan `.env` file ada dan berisi API key yang valid
- Check format: `OPENROUTER_API_KEY=sk-or-v1-...`

### Stickers Tidak Muncul

- Clear chat history: hapus `chat_history.json`
- Restart aplikasi

### AI Tidak Respon

- Check internet connection
- Verify API key masih valid
- Check OpenRouter API status

## 📦 Build for Production

```bash
# Install electron-builder
npm install --save-dev electron-builder

# Build for Windows
npm run build

# Build for macOS
npm run build:mac

# Build for Linux
npm run build:linux
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 👤 Author

Created with ❤️ for awesome conversations with Masha!

## 🙏 Acknowledgments

- Character: Masha (Maria Mikhailovna Kujou) from "Roshidere"
- AI: Google Gemini via OpenRouter
- Icons & Emojis: Unicode Emoji Standard

---

**Made with 💖 using Electron & Gemini AI**

_Enjoy chatting with Masha!_ ✨
