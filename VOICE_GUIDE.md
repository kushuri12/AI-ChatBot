# 🎙️ Voice/Audio Feature Guide

## ✨ **Voice Feature Added!**

Masha sekarang bisa **NGOMONG** dengan suara anime cewe yang natural! 🗣️💖

---

## 🎯 **Features:**

✅ **Text-to-Speech (TTS)** - Masha bacain chat-nya pakai suara  
✅ **Bahasa Indonesia** - Prioritas voice Indonesia untuk natural  
✅ **Suara Cewe** - Female voice dengan anime character feel  
✅ **Pitch Tinggi** - Settings khusus untuk anime girl voice (pitch 1.4)  
✅ **Natural & Clear** - Rate normal (1.0) biar ga kayak robot  
✅ **Gratis & Lokal** - Pakai Web Speech API (built-in browser)  
✅ **Toggle ON/OFF** - Button di header untuk nyalain/matiin  
✅ **Persistent** - Setting tersimpan di localStorage

---

## 🎮 **How to Use:**

### 1. **Enable Voice**

- Klik button **speaker icon** di header (sebelah menu)
- Button akan berubah warna **pink** = Voice ON
- Button abu-abu = Voice OFF

### 2. **Chat Normal**

- Ketik pesan kayak biasa
- Masha akan balas text **DAN** suara!
- Suara otomatis play setiap Masha balas

### 3. **Adjust Settings** (Optional)

Voice udah di-tuning untuk anime character:

- **Pitch**: 1.4 (high pitch untuk anime girl)
- **Rate**: 1.0 (natural speed)
- **Volume**: 1.0 (full volume)

---

## 🇮🇩 **For BEST Experience: Install Indonesian Voice**

### **Windows 10/11:**

1. **Open Settings**

   - Press `Win + I`
   - Atau klik Start → Settings

2. **Go to Language Settings**

   ```
   Settings → Time & Language → Language
   ```

3. **Add Indonesian**

   - Click "Add a language"
   - Search "Indonesian" atau "Bahasa Indonesia"
   - Select "Bahasa Indonesia (Indonesia)"
   - Click "Next" and "Install"

4. **Install Speech**

   - Click on "Bahasa Indonesia" in language list
   - Click "Options"
   - Under "Speech", click "Download"
   - Wait for installation to complete

5. **Restart App**
   - Close Masha chat app
   - Run `npm start` lagi
   - Voice sekarang pakai Indonesian!

### **Alternative: eSpeak-NG (Free Indonesian TTS)**

Kalau default Windows voice kurang natural:

1. Download **eSpeak-NG**: https://github.com/espeak-ng/espeak-ng/releases
2. Install ke Windows
3. Restart browser/app
4. Voice akan otomatis detect

---

## 🎵 **Voice Priority:**

App akan auto-select voice dengan priority ini:

1. **🇮🇩 Indonesian Female** (BEST - natural untuk text Indo)

   - Damayanti
   - Wanita Indonesia
   - Female Indonesia

2. **🇮🇩 Indonesian Any** (Good - at least Indo language)

3. **🇯🇵 Japanese Female** (Anime-like tapi untuk Japanese text)

4. **🇬🇧 English Female** (Fallback - umum ada di semua OS)

   - Zira (Windows)
   - Samantha (Mac)
   - Karen, Moira

5. **Any Female Voice** (Last resort)

---

## 🔧 **Troubleshooting:**

### **Voice ga muncul / ga work:**

```javascript
// Check console untuk debug info:
F12 (Developer Tools) → Console

Kamu akan lihat:
🎙️ Available voices: 15
📋 Voice list:
  0: Microsoft Zira (en-US)
  1: Google Bahasa Indonesia (id-ID)  ← Indonesian!
  ...
✅ Selected voice: Google Bahasa Indonesia
🌍 Voice language: id-ID
```

### **Suara robot banget:**

- Install Indonesian language pack (steps diatas)
- Default system voices sometimes robotic
- Indonesian voices usually more natural

### **Voice ga ada sama sekali:**

- Browser harus support Web Speech API
  - ✅ Chrome/Edge (BEST)
  - ✅ Safari (Mac)
  - ❌ Firefox (limited support)
- Try Chrome/Edge kalau pakai Firefox

### **Volume kekecilan/kegedean:**

- Adjust sistem volume
- Voice settings di code: `volume: 1.0` (0.0 - 1.0)

---

## 💡 **Tips:**

### **Untuk Suara Lebih Natural:**

1. Install Indonesian language pack (steps diatas)
2. Kalau masih robot, coba download **Indonesian TTS engine** tambahan
3. Google "Indonesian TTS Windows" untuk options

### **Untuk Anime Feel Maksimal:**

Settings sekarang:

```javascript
pitch: 1.4; // High pitch = young anime girl
rate: 1.0; // Normal speed = clear & natural
```

Mau lebih tinggi? Edit `js/app.js`:

```javascript
const voiceSettings = {
  pitch: 1.5, // Lebih tinggi lagi!
  rate: 0.95, // Sedikit slower = lebih jelas
  volume: 1.0,
};
```

### **Save Battery:**

- Turn OFF voice kalau ga perlu
- Voice processing consume resources
- Toggle sewaktu-waktu pake button

---

## 🎬 **Example Usage:**

```
User: "halo Masha!"
[Voice ON]
Masha (text): "halo juga"
Masha (voice): 🔊 "halo juga" (dengan suara cewe Indonesia)

User: [Klik voice button = OFF]
Masha (text): "ada apa"
Masha (voice): [silent - voice OFF]
```

---

## 🌟 **Future Improvements:**

Mau upgrade voice system? Ideas:

- [ ] Add pitch/rate slider di UI
- [ ] Voice selector dropdown
- [ ] Custom voice profiles
- [ ] Cloud TTS (Eleven Labs, Google Cloud) untuk super natural voice
- [ ] Voice cloning untuk custom Masha voice

---

## 📚 **Technical Details:**

### **Technology:**

- **Web Speech API** (`window.speechSynthesis`)
- Built-in browser, no external dependencies
- Free & works offline
- Cross-platform (Windows, Mac, Linux)

### **How it Works:**

```javascript
1. User chat → Masha generates response
2. Response text → speak() function
3. SpeechSynthesisUtterance created
4. Voice + settings applied
5. synth.speak() → audio output!
```

### **Voice Detection:**

```javascript
// App auto-detects all system voices
synth.getVoices(); // Returns array of available voices
// Then filters by language & gender
```

---

## 🎉 **Enjoy Natural Anime Voice Chat!**

Masha sekarang bisa ngobrol dengan suara yang lebih hidup!

**Pro Tip:** Install Indonesian voice pack untuk experience terbaik! 🇮🇩✨

---

**Made with 💖 using Web Speech API**
