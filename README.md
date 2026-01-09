# Chat Masha 💬

Aplikasi chat dengan AI chatbot Masha (dari Roshidere) menggunakan OpenRouter API.

## ✨ Fitur

### 🤖 **ULTRA INTELLIGENT AI** (NEW!)

- 🧠 **Advanced Memory System** - Perfect photographic memory, inget SEMUA detail
- 🎯 **Predictive Intelligence** - Anticipate user needs sebelum diminta
- 🎭 **Emotional Genius** - Baca emosi dengan 8+ emotion detection
- 📊 **Topic Graph** - Connect & track relationships antar topik
- 💡 **Learning System** - Makin lama makin pintar & personal
- 🔮 **Context Mastery** - Recall conversation dari minggu lalu dengan detail

### 💬 **Core Features**

- 🤖 **AI Chatbot** - Chat dengan Masha yang punya supreme intelligence
- 😊 **Stickers** - Kirim emoji sticker kayak WhatsApp
- 💾 **Chat History** - Otomatis simpan riwayat chat
- 📱 **Responsive UI** - Tampilan modern dan smooth

**[📖 Baca lengkap tentang AI Intelligence System →](AI_INTELLIGENCE.md)**

## 🚀 Cara Pakai

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Buat file `.env` di root folder:

```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

Dapatkan API key gratis di: https://openrouter.ai/

### 3. Jalankan Aplikasi

```bash
npm start
```

Aplikasi akan terbuka otomatis di Electron window.

## 🎯 Cara Kerja

1. **Chatbot**: Menggunakan Gemini 2.0 Flash Lite melalui OpenRouter
2. **Memory**: Menyimpan chat history di `chat_history.json`
3. **Context**: Tracking mood dan topik di `context_memory.json`

## 📝 Catatan

- ❌ **STT (Speech-to-Text)** - Dihapus
- ❌ **TTS (Text-to-Speech)** - Dihapus
- ✅ **Chatbot AI** - Aktif & berfungsi

## 🛠️ Tech Stack

- **Electron** - Desktop app framework
- **OpenRouter API** - AI gateway
- **Gemini 2.0** - AI model
- **Tailwind CSS** - Styling
- **Node.js** - Backend

## 📦 File Structure

```
├── index.html          # Main UI
├── js/
│   └── app.js         # Main logic (no STT/TTS)
├── css/
│   └── style.css      # Custom styles
├── main.js            # Electron main process
├── chat_history.json  # Chat history storage
└── context_memory.json # Context tracking
```

## 🎨 Personality

Masha adalah AI chatbot dengan karakteristik:

- Sarcastic tapi caring
- Genius-level intelligence
- Perfect photographic memory
- Natural Indonesian language
- Bestie vibes (bukan romantic)

---

Made with ❤️ by Mila/Kuru
