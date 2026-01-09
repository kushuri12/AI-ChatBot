# 🎙️ Natural Voice Setup - ElevenLabs Integration

## 🎯 **Problem: Web Speech API Sounds Robotic**

Default browser TTS (Web Speech API) memang kadang terdengar robot. Untuk voice kayak **Neuro-sama** yang super natural, kita perlu **AI-powered TTS**.

---

## ✨ **Solution: ElevenLabs TTS**

**ElevenLabs** adalah platform Text-to-Speech terbaik di dunia, dipakai oleh:

- ✅ VTubers (termasuk yang mirip Neuro-sama)
- ✅ Content creators
- ✅ Professional productions
- ✅ AI assistants

### **Why ElevenLabs?**

- 🎵 **SUPER NATURAL** - Suara mirip manusia asli
- 🎭 **Emotional** - Bisa ekspresif, ga monoton
- 🌍 **Multilingual** - Support Bahasa Indonesia!
- 🎨 **Banyak voice** - Pilih yang cocok untuk Masha
- 💰 **Free Tier** - 10,000 characters/month gratis!

---

## 🚀 **Quick Setup (5 Minutes)**

### **Step 1: Get Free API Key**

1. **Sign Up** di https://elevenlabs.io/

   - Klik "Get Started Free"
   - Daftar dengan email
   - Verify email

2. **Get API Key**

   - Login ke dashboard
   - Klik profile icon (kanan atas)
   - Select "Profile"
   - Copy your API key

3. **Add to .env**
   ```bash
   # Open .env file
   # Add this line:
   ELEVENLABS_API_KEY=your_api_key_here
   ```

### **Step 2: Choose Voice**

1. Go to **Voice Library**: https://elevenlabs.io/voice-library

2. **Recommended voices for Masha** (anime character):

   - **Rachel** - Young female, energetic
   - **Bella** - Soft, gentle
   - **Elli** - Youthful, expressive
   - **Sarah** - Natural, friendly (DEFAULT)

3. **Copy Voice ID**:
   - Click on voice
   - Copy ID (e.g., `EXAVITQu4vr4xnSDxMaL`)

### **Step 3: Update Code**

Open `js/voice-natural.js` and update:

```javascript
selectedVoiceId: 'YOUR_VOICE_ID_HERE',
```

### **Step 4: Restart App**

```bash
npm start
```

**Done!** Voice sekarang pakai ElevenLabs! 🎉

---

## 🎨 **Voice Selection Guide**

### **Best Voices for Anime Character (Masha):**

| Voice Name             | ID                     | Character                    |
| ---------------------- | ---------------------- | ---------------------------- |
| **Sarah** (⭐ DEFAULT) | `EXAVITQu4vr4xnSDxMaL` | Natural, friendly, cheerful  |
| **Rachel**             | `21m00Tcm4TlvDq8ikWAM` | Young, energetic, expressive |
| **Bella**              | `EXAVITQu4vr4xnSDxMaL` | Soft, gentle, calm           |
| **Elli**               | `MF3mGyEYCl7XYWbV9V6O` | Youthful, slight accent      |
| **Domi**               | `AZnzlk1XvdvUeBnXmlld` | Strong, confident            |

### **Preview Voices:**

https://elevenlabs.io/voice-library

---

## ⚙️ **Advanced Settings**

### **Voice Settings untuk Anime Character:**

Edit `js/voice-natural.js`:

```javascript
voice_settings: {
  stability: 0.5,        // 0-1: Lower = more expressive
  similarity_boost: 0.75, // 0-1: Voice consistency
  style: 0.5,            // 0-1: Style exaggeration
  use_speaker_boost: true // Enhance clarity
}
```

**For Masha (sarcastic but caring):**

```javascript
{
  stability: 0.4,        // More expressive for sarcasm
  similarity_boost: 0.8, // Consistent character
  style: 0.6,            // Slightly exaggerated
  use_speaker_boost: true
}
```

**For calm/gentle character:**

```javascript
{
  stability: 0.7,        // More stable, calm
  similarity_boost: 0.7,
  style: 0.3,            // Less exaggeration
  use_speaker_boost: true
}
```

---

## 💰 **Pricing & Limits**

### **Free Tier:**

- ✅ **10,000 characters/month** (gratis selamanya!)
- ✅ Semua voices
- ✅ Commercial use OK
- ✅ No credit card required

### **Usage Estimate:**

```
Average message = 50 characters
10,000 chars = 200 messages/month
= ~7 messages/day

Cukup untuk testing & personal use!
```

### **If You Need More:**

- **Starter**: $5/month = 30,000 chars
- **Creator**: $22/month = 100,000 chars
- **Pro**: $99/month = 500,000 chars

---

## 🔧 **Implementation Details**

### **How It Works:**

```
User chat → Masha response generated
                ↓
        [Voice System Check]
                ↓
    ┌─────────┴──────────┐
    ↓                    ↓
ElevenLabs API?     Web Speech API
(if key exists)     (fallback)
    ↓                    ↓
Natural voice       Robot voice
```

### **Hybrid System Benefits:**

- ✅ Best quality when online (ElevenLabs)
- ✅ Always works (Web Speech fallback)
- ✅ No dependency on external service
- ✅ Graceful degradation

---

## 📊 **Comparison**

| Feature       | Web Speech API | ElevenLabs               |
| ------------- | -------------- | ------------------------ |
| **Quality**   | 😐 Robot-like  | ⭐⭐⭐⭐⭐ Super natural |
| **Cost**      | Free unlimited | Free 10k chars/month     |
| **Offline**   | ✅ Yes         | ❌ Need internet         |
| **Setup**     | ✅ Zero        | ⚙️ Need API key          |
| **Languages** | Limited        | 29+ languages            |
| **Emotions**  | ❌ Monoton     | ✅ Expressive            |
| **Latency**   | Instant        | ~1-2 seconds             |

---

## 🎤 **Alternative Options**

Kalau ElevenLabs ga cocok, alternatives:

### **1. PlayHT** (Similar quality)

- Natural voice like ElevenLabs
- Free tier: 2,500 words/month
- https://play.ht

### **2. Google Cloud TTS** (Good quality)

- Neural voices
- $4/month for 1M chars
- https://cloud.google.com/text-to-speech

### **3. Azure Cognitive TTS** (Professional)

- Neural voices
- Free tier: 500k chars/month
- https://azure.microsoft.com/en-us/services/cognitive-services/text-to-speech/

### **4. Coqui TTS** (Offline, Open Source)

- Free unlimited
- Runs locally
- More complex setup
- https://github.com/coqui-ai/TTS

---

## 🐛 **Troubleshooting**

### **Voice masih robot / ga berubah:**

```javascript
// Check console:
✅ ElevenLabs TTS enabled (Natural Voice)  ← Should see this!

// If you see:
ℹ️ ElevenLabs API key not found
→ Check .env file has ELEVENLABS_API_KEY
```

### **Error: "Invalid API key":**

- Double check API key di .env
- No spaces atau quotes
  ```
  ELEVENLABS_API_KEY=sk_abc123...  ✅
  ELEVENLABS_API_KEY="sk_abc123" ❌
  ELEVENLABS_API_KEY = sk_abc123  ❌
  ```

### **Error: "Quota exceeded":**

- Free tier limit reached (10k chars)
- Wait for next month reset
- Or upgrade plan

### **Suara delay / lambat:**

- Normal! API call butuh 1-2 detik
- Tradeoff untuk quality
- Add loading indicator if needed

---

## 💡 **Pro Tips**

### **1. Save Characters:**

```javascript
// Don't speak long responses
if (text.length > 200) {
  text = text.substring(0, 200) + "...";
}
```

### **2. Cache Common Phrases:**

```javascript
// Pre-generate common responses
const audioCache = {
  halo: "cached-audio-blob",
  iya: "cached-audio-blob",
};
```

### **3. Voice Switching:**

```javascript
// Different voices for different moods
if (mood === "sarcastic") {
  voiceId = "voice-id-sarcastic";
} else if (mood === "caring") {
  voiceId = "voice-id-gentle";
}
```

---

## 🎉 **Result**

**Before (Web Speech):**

```
"halo juga"
🤖 [robot monoton voice]
```

**After (ElevenLabs):**

```
"halo juga"
🎙️ [natural anime girl voice with expression!]
```

---

## 📚 **Resources**

- **ElevenLabs Docs**: https://docs.elevenlabs.io/
- **Voice Library**: https://elevenlabs.io/voice-library
- **API Reference**: https://elevenlabs.io/docs/api-reference
- **Pricing**: https://elevenlabs.io/pricing
- **Discord**: https://discord.gg/elevenlabs

---

## ⚠️ **Important Notes**

1. **API Key Security**:

   - NEVER commit `.env` to Git ✅ Already in .gitignore
   - Don't share API key publicly

2. **Rate Limits**:

   - Free tier: ~20 requests/minute
   - Plenty for chat app

3. **Character Counting**:

   - Punctuation counts
   - Spaces count
   - Monitor usage in dashboard

4. **Commercial Use**:
   - Free tier allows commercial use
   - Read Terms of Service

---

**SETUP ELEVENLABS UNTUK VOICE NATURAL KAYAK NEURO-SAMA!** 🎙️✨

Natural anime voice = better experience! 💖
