# 🎨 Custom Sticker System - Complete Guide

## ✅ Feature Overview

Sekarang kamu bisa:

1. ✅ Upload gambar sticker sendiri
2. ✅ Kasih arti/meaning untuk tiap sticker
3. ✅ AI baca dan ngerti maksud sticker
4. ✅ AI bisa respond sesuai emosi sticker
5. ✅ Sticker muncul di sticker picker bareng emoji

---

## 📁 Folder Structure

```
isengaja/
├── sticker/                    # Folder custom stickers
│   ├── stickers.json          # Metadata stickers
│   ├── README.md              # Guide ini
│   ├── marah.png              # Contoh: sticker marah
│   ├── happy.gif              # Contoh: sticker happy
│   └── ... (sticker lainnya)
```

---

## 🚀 Quick Start

### Step 1: Upload Gambar

Taruh file gambar ke folder `sticker/`

- Format: PNG, GIF, JPG
- Size: < 500KB recommended
- Ukuran: 128x128 atau 256x256 pixels

### Step 2: Edit stickers.json

```json
{
  "stickers": [
    {
      "filename": "marah.png",
      "meaning": "marah banget",
      "description": "Pas lagi kesel atau annoyed"
    },
    {
      "filename": "happy.gif",
      "meaning": "seneng banget",
      "description": "Pas lagi happy atau dapat kabar baik"
    }
  ]
}
```

### Step 3: Restart App

```bash
npm start
```

Done! Sticker muncul di sticker picker! 🎉

---

## 📝 Sticker Entry Format

```json
{
  "filename": "nama_file.png", // REQUIRED: Nama file di folder sticker/
  "meaning": "arti singkat", // REQUIRED: AI baca ini untuk ngerti
  "description": "context lengkap" // OPTIONAL: Kapan/gimana pakainya
}
```

### Field Explanation:

**filename** (REQUIRED)

- Nama file gambar yang ada di folder `sticker/`
- Contoh: `"angry.png"`, `"happy.gif"`

**meaning** (REQUIRED)

- Arti singkat yang AI mudah ngerti
- Contoh: `"marah"`, `"sedih"`, `"senang"`
- Jangan terlalu panjang (1-3 kata ideal)

**description** (OPTIONAL)

- Context tambahan kapan sticker dipake
- Membantu AI lebih paham situasi
- Contoh: `"Pas lagi kesel sama sesuatu"`

---

## 💡 Best Practices

### 1. Naming Conventions

```
✅ GOOD:
- angry.png
- happy_excited.gif
- thinking_confused.png

❌ BAD:
- IMG_1234.png
- Screenshot 2024.jpg
- untitled.gif
```

### 2. Meaningful Meanings

```
✅ GOOD:
"marah banget"
"seneng"
"bingung"
"sayang"

❌ BAD:
"sticker 1"
"gambar"
"emosi"
```

### 3. Helpful Descriptions

```
✅ GOOD:
"Pas lagi kesel atau marah sama sesuatu"
"Dipakai saat happy atau dapat kabar baik"
"Waktu lagi bingung atau ga ngerti"

❌ BAD:
"sticker"
"gambar marah"
""
```

---

## 🎯 Example Sticker Packs

### Emotion Pack

```json
{
  "stickers": [
    {
      "filename": "angry.png",
      "meaning": "marah banget",
      "description": "Pas lagi kesel atau annoyed"
    },
    {
      "filename": "sad.png",
      "meaning": "sedih",
      "description": "Pas lagi down atau kecewa"
    },
    {
      "filename": "happy.png",
      "meaning": "seneng banget",
      "description": "Pas lagi happy atau excited"
    },
    {
      "filename": "love.png",
      "meaning": "sayang",
      "description": "Mau tunjukin care atau affection"
    }
  ]
}
```

### Reaction Pack

```json
{
  "stickers": [
    {
      "filename": "lol.gif",
      "meaning": "ngakak",
      "description": "Ketawa banget, lucu parah"
    },
    {
      "filename": "shocked.png",
      "meaning": "kaget banget",
      "description": "Terkejut atau ga percaya"
    },
    {
      "filename": "thinking.png",
      "meaning": "lagi mikir",
      "description": "Bingung atau mau mikir dulu"
    }
  ]
}
```

---

## 🤖 How AI Uses Custom Stickers

### When You Send:

```
User: *clicks custom sticker "angry.png"*
```

### What AI Sees:

```
[User sent custom sticker: "marah banget" (Pas lagi kesel atau annoyed)]
```

### AI Responds Based On Meaning:

```
AI: "kenapa si? ada apa?"
```

or

```
AI: "kesel kenapa emg?"
```

✅ AI understands the emotion and responds naturally!

---

## 🎨 Image Recommendations

### Size & Format

- PNG recommended (transparency support)
- GIF for animated stickers
- 128x128 or 256x256 pixels
- < 500KB file size

### Style

- Simple, clear images
- Expressive faces/emotions
- High contrast colors
- Not too detailed

### Where to Find?

- Create your own
- FreePik (with attribution)
- Emoji kitchen
- Custom art commission

---

## 🔧 Troubleshooting

### Sticker Not Showing?

1. Check filename di `stickers.json` sama dengan file asli
2. Pastikan gambar ada di folder `sticker/`
3. Restart app (`npm start`)
4. Check console untuk error messages

### Image Error (Red X)?

- File path salah
- File corrupt/rusak
- Format tidak supported
- File size terlalu besar

### AI Doesn't Understand?

- `meaning` terlalu vague → Bikin lebih specific
- Tambahkan `description` untuk context
- Use simple, clear words

---

## 📊 Technical Details

### Supported Formats

✅ PNG (recommended)
✅ GIF (animated support)
✅ JPG/JPEG
❌ SVG (not supported)
❌ WEBP (limited support)

### Load Process

1. App reads `sticker/stickers.json`
2. Validates each entry
3. Loads images from `sticker/` folder
4. Displays in sticker picker
5. Sends meaning to AI context

### AI Context Format

```javascript
// Emoji sticker
"[User sent sticker: 😊]";

// Custom sticker
"[User sent custom sticker: \"marah banget\" (Pas lagi kesel)]";
```

---

## 🎉 Ready to Use!

1. Upload your stickers to `sticker/` folder
2. Edit `stickers.json` dengan meanings
3. Restart app
4. Enjoy custom stickers with AI! 🚀

---

## Example: Complete Setup

### Files in sticker/ folder:

```
sticker/
├── stickers.json
├── angry.png
├── happy.gif
├── love.png
└── thinking.png
```

### stickers.json content:

```json
{
  "stickers": [
    {
      "filename": "angry.png",
      "meaning": "marah banget",
      "description": "Pas lagi kesel"
    },
    {
      "filename": "happy.gif",
      "meaning": "seneng banget",
      "description": "Pas lagi happy"
    },
    {
      "filename": "love.png",
      "meaning": "sayang",
      "description": "Tunjukin care"
    },
    {
      "filename": "thinking.png",
      "meaning": "lagi mikir",
      "description": "Bingung atau wondering"
    }
  ]
}
```

### Result:

✅ 4 custom stickers loaded
✅ AI understands each meaning
✅ Shows in sticker picker with emojis
✅ Natural conversation with stickers!

---

Need help? Check console logs for debug info! 🐛
