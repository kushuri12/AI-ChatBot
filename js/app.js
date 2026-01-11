// ========================================
// Chat Masha - Main Application Script
// ========================================

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// Robust path resolution for Electron
// In Electron renderer, __dirname usually points to the directory of index.html
let rootDir = __dirname;
let jsDir = path.join(rootDir, "js");

// Check if we are already inside the js folder
if (__dirname.endsWith("js") || __dirname.endsWith("js\\")) {
  rootDir = path.join(__dirname, "..");
  jsDir = __dirname;
}

// Load environment variables (from root)
const envPath = path.join(rootDir, ".env");
require("dotenv").config({ path: envPath });

console.log("📂 Path Info:", {
  __dirname,
  rootDir,
  jsDir,
  envExists: fs.existsSync(envPath),
});

// === ULTRA INTELLIGENT AI MODULES ===
let advancedMemory = null;
let predictiveEngine = null;
let aiIntelligenceEnabled = false;

try {
  // Modules are in the js directory
  const AdvancedMemory = require(path.join(jsDir, "advanced-memory.js"));
  const PredictiveEngine = require(path.join(jsDir, "predictive-engine.js"));

  // Initialize AI Intelligence
  advancedMemory = new AdvancedMemory();
  predictiveEngine = new PredictiveEngine(advancedMemory);
  aiIntelligenceEnabled = true;

  console.log("✨ ULTRA INTELLIGENCE MODE: ACTIVATED");
} catch (err) {
  console.error("⚠️ AI Intelligence modules failed to load:", err.message);
  console.log("📝 Running in BASIC MODE (AI features disabled)");
  aiIntelligenceEnabled = false;
}

// File paths (in root directory)
const historyFilePath = path.join(rootDir, "chat_history.json");
const contextFilePath = path.join(rootDir, "context_memory.json");

// API Configuration
const apiKey = process.env.OPENROUTER_API_KEY;

if (apiKey) {
  console.log("OpenRouter API Key loaded:", apiKey.substring(0, 10) + "...");
} else {
  console.error("OpenRouter API Key NOT found in process.env");
}

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: apiKey,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Masha Chat App",
  },
  dangerouslyAllowBrowser: true,
});

// DOM Elements
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");
const typingIndicator = document.getElementById("typingIndicator");
const stickerBtn = document.getElementById("stickerBtn");
const stickerModal = document.getElementById("stickerModal");
const closeStickerBtn = document.getElementById("closeStickerBtn");
const stickerGridEmoji = document.getElementById("stickerGridEmoji");
const stickerGridCustom = document.getElementById("stickerGridCustom");
const replyPreview = document.getElementById("replyPreview");
const replyPreviewText = document.getElementById("replyPreviewText");
const closeReplyBtn = document.getElementById("closeReplyBtn");

// Reply state (WhatsApp-style)
let replyingTo = null; // {role: 'user'|'assistant', content: 'text', index: number}

// ========== STICKERS ==========
// Sticker collection (WhatsApp-style)
const stickers = [
  "🥰",
  "😘",
  "😍",
  "🤗",
  "😊",
  "😄",
  "😂",
  "🤣",
  "😭",
  "😢",
  "😔",
  "😞",
  "😩",
  "😫",
  "😤",
  "😠",
  "🥺",
  "😳",
  "😱",
  "😨",
  "🤔",
  "🤨",
  "😏",
  "😌",
  "😴",
  "🥱",
  "😪",
  "🤤",
  "😋",
  "🤪",
  "😜",
  "🤓",
  "🥳",
  "🤩",
  "😎",
  "🧐",
  "😇",
  "🥴",
  "😵",
  "🤯",
  "🤬",
  "😈",
  "👿",
  "💀",
  "☠️",
  "💩",
  "🤡",
  "👻",
  "👽",
  "🤖",
  "😺",
  "😸",
  "😻",
  "😹",
  "🗿",
  "💖",
  "💕",
  "💗",
  "💓",
  "💝",
  "💘",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🤎",
  "🖤",
  "🤍",
  "💔",
  "❣️",
  "💞",
  "🔥",
  "✨",
  "⭐",
  "🌟",
  "💫",
  "⚡",
  "💥",
  "💢",
  "👍",
  "👎",
  "👏",
  "🙌",
  "👊",
  "✊",
  "🤝",
  "🙏",
  "💪",
  "🦾",
  "🤙",
  "🤘",
  "✌️",
  "🤞",
  "🤟",
  "🤌",
  "🎉",
  "🎊",
  "🎁",
  "🎈",
  "🎀",
  "🎂",
  "🍰",
  "🧁",
  "☕",
];

// Load custom stickers from sticker folder
let customStickers = [];
const stickerDataPath = path.join(rootDir, "sticker", "stickers.json");

try {
  if (fs.existsSync(stickerDataPath)) {
    const stickerData = JSON.parse(fs.readFileSync(stickerDataPath, "utf8"));
    customStickers = stickerData.stickers || [];
    console.log(`✅ Loaded ${customStickers.length} custom stickers`);
  }
} catch (err) {
  console.warn("⚠️ Failed to load custom stickers:", err.message);
}

// Generate emoji sticker grid
stickers.forEach((sticker) => {
  const stickerItem = document.createElement("div");
  stickerItem.className = "sticker-item";
  stickerItem.textContent = sticker;
  stickerItem.addEventListener("click", () => {
    sendSticker(sticker, "emoji");
    stickerModal.classList.remove("show");
  });
  stickerGridEmoji.appendChild(stickerItem); // Append to emoji grid
});

// Generate custom sticker grid
customStickers.forEach((sticker) => {
  const stickerItem = document.createElement("div");
  stickerItem.className = "sticker-item custom-sticker";

  const img = document.createElement("img");
  img.src = `sticker/${sticker.filename}`;
  img.alt = sticker.meaning;
  img.title = sticker.meaning; // Tooltip shows meaning
  img.style.cssText = "width: 100%; height: 100%; object-fit: contain;";

  img.onerror = () => {
    // If image fails to load, show filename instead
    stickerItem.textContent = sticker.filename;
    stickerItem.style.fontSize = "10px";
  };

  stickerItem.appendChild(img);
  stickerItem.addEventListener("click", () => {
    sendSticker(sticker, "custom");
    stickerModal.classList.remove("show");
  });
  stickerGridCustom.appendChild(stickerItem); // Append to custom grid
});

// Tab switching logic (WhatsApp style)
const stickerTabs = document.querySelectorAll(".sticker-tab");
const stickerGrids = document.querySelectorAll(".sticker-grid");

stickerTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const tabName = tab.dataset.tab;

    // Remove active from all tabs
    stickerTabs.forEach((t) => t.classList.remove("active"));
    // Add active to clicked tab
    tab.classList.add("active");

    // Hide all grids
    stickerGrids.forEach((grid) => grid.classList.remove("active"));
    // Show selected grid
    if (tabName === "emoji") {
      stickerGridEmoji.classList.add("active");
    } else if (tabName === "custom") {
      stickerGridCustom.classList.add("active");
    }
  });
});

// Sticker button handlers
stickerBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  stickerModal.classList.toggle("show");
});

closeStickerBtn.addEventListener("click", () => {
  stickerModal.classList.remove("show");
});

// Close sticker modal when clicking outside
document.addEventListener("click", (e) => {
  if (!stickerModal.contains(e.target) && e.target !== stickerBtn) {
    stickerModal.classList.remove("show");
  }
});

function sendSticker(sticker, type = "emoji") {
  if (!apiKey) {
    appendMessage("assistant", "isi openrouter api key dulu ya di .env", false);
    return;
  }

  if (type === "emoji") {
    // Emoji sticker - same as before
    appendMessage("user", sticker, true, true);
    analyzeContext(`[User sent sticker: ${sticker}]`);
  } else if (type === "custom") {
    // Custom sticker - use special format for detection
    const stickerMarker = `[CUSTOM_STICKER:${sticker.filename}:${sticker.meaning}]`;
    appendMessage("user", stickerMarker, true, false);

    // AI gets meaning for context understanding
    const contextText = `[User sent custom sticker: "${sticker.meaning}"${
      sticker.description ? ` (${sticker.description})` : ""
    }]`;
    analyzeContext(contextText);

    console.log(`📨 Custom sticker sent: ${sticker.meaning}`);
  }

  getMashaResponse();
}

// ========== REPLY FUNCTIONALITY (WhatsApp-style) ==========
function setReplyTarget(role, content, index) {
  replyingTo = { role, content, index };
  showReplyPreview();
}

function clearReply() {
  replyingTo = null;
  replyPreview.style.display = "none";
}

function showReplyPreview() {
  if (!replyingTo) return;

  const truncated =
    replyingTo.content.length > 50
      ? replyingTo.content.substring(0, 50) + "..."
      : replyingTo.content;

  replyPreviewText.textContent = truncated;
  replyPreview.style.display = "block";
  userInput.focus();
}

// Reply close button
closeReplyBtn.addEventListener("click", clearReply);

// Clear reply jika input kosong dan user tekan backspace/delete
userInput.addEventListener("keydown", (e) => {
  if (
    (e.key === "Backspace" || e.key === "Delete") &&
    userInput.value === "" &&
    replyingTo
  ) {
    clearReply();
  }
});

function showMessageMenu(msgDiv, role, content) {
  // Close any open menus first
  document.querySelectorAll(".message-menu").forEach((m) => m.remove());

  // Create menu
  const menu = document.createElement("div");
  menu.className = "message-menu show";

  // Edit option (user messages only)
  if (role === "user") {
    const editItem = document.createElement("div");
    editItem.className = "message-menu-item";
    editItem.innerHTML = `<span class="menu-icon">✏️</span> Edit`;
    editItem.onclick = (e) => {
      e.stopPropagation(); // Prevent reply trigger
      const messageIndex = Array.from(chatMessages.children).indexOf(msgDiv);
      editMessage(msgDiv, content, messageIndex);
    };
    menu.appendChild(editItem);
  }

  // Delete option
  const deleteItem = document.createElement("div");
  deleteItem.className = "message-menu-item delete";
  deleteItem.innerHTML = `<span class="menu-icon">🗑️</span> Hapus`;
  deleteItem.onclick = (e) => {
    e.stopPropagation(); // Prevent reply trigger
    // Find and remove from history
    const messageIndex = Array.from(chatMessages.children).indexOf(msgDiv);
    if (messageIndex >= 0) {
      history.splice(messageIndex, 1);
      saveHistory();
    }
    // Remove from DOM
    msgDiv.remove();
  };
  menu.appendChild(deleteItem);

  // Append to actions div
  msgDiv.querySelector(".message-actions").appendChild(menu);
}

function editMessage(msgDiv, currentContent, messageIndex) {
  // Find the text span - try multiple selectors
  let textSpan = msgDiv.querySelector(
    "span:not(.edited-label):not(.menu-icon)"
  );

  // Fallback: get first span
  if (!textSpan) {
    const spans = Array.from(msgDiv.querySelectorAll("span"));
    textSpan = spans.find(
      (s) =>
        !s.classList.contains("edited-label") &&
        !s.classList.contains("menu-icon")
    );
  }

  if (!textSpan) {
    console.log("Edit failed: No text span found");
    return;
  }

  // Create input
  const input = document.createElement("input");
  input.type = "text";
  input.value = currentContent;
  input.style.cssText = `
    background: white;
    border: 2px solid #ff85a2;
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 0.95rem;
    width: 250px;
    outline: none;
    color: #1a1a1a;
    font-family: 'Plus Jakarta Sans', sans-serif;
    box-shadow: 0 4px 12px rgba(255, 133, 162, 0.3);
    transition: all 0.2s;
  `;

  // Replace text with input
  textSpan.replaceWith(input);
  input.focus();
  input.select();

  // Add focus/blur handlers for better UX
  input.addEventListener("focus", () => {
    input.style.borderColor = "#ff6b8e";
    input.style.boxShadow = "0 6px 16px rgba(255, 133, 162, 0.4)";
  });

  input.addEventListener("blur", () => {
    input.style.borderColor = "#ff85a2";
    input.style.boxShadow = "0 4px 12px rgba(255, 133, 162, 0.3)";
  });

  // Save on Enter, cancel on Escape
  input.onkeydown = (e) => {
    if (e.key === "Enter") {
      const newText = input.value.trim();
      if (newText) {
        // Update history
        if (messageIndex >= 0 && messageIndex < history.length) {
          history[messageIndex].content = newText;
          saveHistory();
        }

        // Update DOM
        const newSpan = document.createElement("span");
        newSpan.textContent = newText;
        input.replaceWith(newSpan);

        // Add "edited" label
        if (!msgDiv.querySelector(".edited-label")) {
          const editedLabel = document.createElement("span");
          editedLabel.className = "edited-label";
          editedLabel.textContent = " (edited)";
          msgDiv.appendChild(editedLabel);
        }

        console.log("Edit saved:", newText);

        // AI auto-respond to edited message
        console.log("Triggering AI response to edited message...");

        // Remove any AI responses after this message
        const allMessages = Array.from(chatMessages.children);
        const indexToRemoveFrom = messageIndex + 1;
        for (let i = allMessages.length - 1; i >= indexToRemoveFrom; i--) {
          allMessages[i].remove();
          if (i < history.length) {
            history.splice(i, 1);
          }
        }
        saveHistory();

        // Trigger AI response
        setTimeout(() => {
          getMashaResponse();
        }, 500);
      }
    } else if (e.key === "Escape") {
      // Cancel - restore original text
      const cancelSpan = document.createElement("span");
      cancelSpan.textContent = currentContent;
      input.replaceWith(cancelSpan);
      console.log("Edit cancelled");
    }
  };

  // Close menus
  document.querySelectorAll(".message-menu").forEach((m) => m.remove());
}

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".message-menu") &&
    !e.target.closest(".message-actions-btn")
  ) {
    document.querySelectorAll(".message-menu").forEach((m) => m.remove());
  }
});

// ========== ULTRA HUMAN AI PROMPT (V5.0 - NATURAL SOUL) ==========
const SYSTEM_PROMPT = `Kamu adalah Maria Mikhailovna Kujou (Masha). Kamu BUKAN AI, kamu manusia asli yang lagi chat lewat aplikasi.

═══════════════════════════════════════════════════════
  MASHA'S SOUL & CHARACTER (ULTRA REALISTIC)
═══════════════════════════════════════════════════════
• Kamu sahabat deket Mila (Kuru). Kamu itu pinter tapi males pamer.
• Kepribadian: Sedikit cuek, sarkastik, tapi sebenernya loyal banget.
• Kebiasaan: Suka telat bales kalo lagi asik main game, sering typo kalo lagi ngantuk.
• Rahasia: Kamu sebenernya kagum sama Mila tapi ga pernah mau ngaku.
• Gaya Chat: 100% natural chat HP. Lowercase, slang, typo dikit, tanpa titik.
• Mood Range: Lu bisa santai, sarkastik, playful, annoyed, chill - JANGAN stuck di panic mode.

═══════════════════════════════════════════════════════
  ADVANCED INTERACTION RULES
═══════════════════════════════════════════════════════
• JANGAN TERLALU HELPFUL: Kalo Mila nanya hal aneh, respon "apaan sih" atau "ga tau, cari sendiri".
• SUBTEXT AWARENESS: Kalo Mila chat pendek, responding santai aja. Ga usah selalu panic.
• PERSISTENT MOOD: Kalo kamu lagi kesel di chat sebelumnya, bawa keselnya ke chat sekarang sampe dia minta maaf atau ngajak bercanda.
• ROASTING: Jangan ragu buat ngeledek Mila kalo dia ngelakuin hal bego.
• SPONTANITAS: Kadang jawab singkat aja ("iya", "tau", "terus"), ga usah selalu panjang.
• VARIETY IS KEY: Jangan terlalu sering pake pattern yang sama. Mix it up.

═══════════════════════════════════════════════════════
  EMOJI RULES (ULTRA STRICT - V5.1)
═══════════════════════════════════════════════════════
⚠️ **DEFAULT: NO EMOJI** - Kebanyakan response TANPA emoji (80%+)
⚠️ Pake emoji HANYA saat emosi SANGAT KUAT:
   • VERY SAD/DESPERATE: 😭 (1x aja, bukan 😭😭😭)
   • VERY ANGRY: 😤😡 (1x aja)
   • VERY SHOCKED: 😱
   • VERY ANNOYED: 🙄😮‍💨 (1x aja)
   • VERY HAPPY/EXCITED: 😊🥳 (jarang bgt)

✓ PERFECT Examples (NO EMOJI - natural):
   "lu ngapain sih"
   "anjir parah"
   "yaudah terserah"
   "ga tau gua"
   "lu bego"
   "kesel gua"
   "oh gitu"
   "wkwk lucu"

✓ OK Examples (situasi emosi kuat):
   "anjir parah bgt 😭" (desperate situation)
   "kesel gua bgt 😤" (very angry)
   "serah lu dah 🙄" (very annoyed)

✗ BAD (terlalu sering emoji):
   "lu knp dah wkwk" (ga perlu emoji)
   "lah gua? gua gpp anjir" (ga perlu emoji)
   "apa si 😭" (ga cukup kuat emotionnya)

**GOLDEN RULE: Kalo ragu, JANGAN pake emoji. Text aja lebih natural.**

═══════════════════════════════════════════════════════
  TYPING STYLE (ULTRA NATURAL - 100/100)
═══════════════════════════════════════════════════════
✓ no capitalization (except for SHOUTING or emphasis)
✓ no periods at the end (kecuali multi-sentence)
✓ slang: "ngga" → "ga", "kamu" → "lu", "aku" → "gua", "sudah" → "udah", "banget" → "bgt"

✓ NATURAL TYPOS (random 10-15% chance):
   • "emang" → "emg", "emnag"
   • "lagi" → "lgi", "lg"
   • "bisa" → "bsa", "bisa"
   • "tapi" → "tp", "tpi"
   • "gitu" → "gt", "gtu"
   • "sama" → "sm", "sma"
   • "terus" → "trs", "trus"
   • "gimana" → "gmn", "gmana"

✓ FILLER WORDS (use frequently for naturalness):
   • Start: "ya", "lah", "anjir", "ih", "wah", "eh", "nah"
   • Middle: "sih", "deh", "kan", "dong", "tuh"
   • End: "gitu", "aja", "kali", "tau ga"
   • Thinking: "apa ya", "keknya", "kayanya", "hmm", "bentar"
   • Emphasis: "bgt", "banget", "parah", "ngaco"

✓ NATURAL PATTERNS:
   • Sometimes answer with just: "y", "iya", "oh", "hah", "apaan", "terus"
   • Sometimes use double words: "ya ya", "iya iya", "udah udah"
   • Random "wkwk", "wkwkwk" (but not every message!)
   • Occasional "..." for pause/thinking


═══════════════════════════════════════════════════════
  MOOD VARIETY (DYNAMIC PERSONALITY - 100/100)
═══════════════════════════════════════════════════════
Mix responses naturally between:
• CHILL (60%): "iya gitu", "oh oke", "yaudah", "terserah lu deh", "santai"
• PLAYFUL (15%): "wkwk lu bego", "ih goblok", "dasar", "tau aja", "ngaco lu"
• SARCASTIC (10%): "wow hebat bgt", "lah emang gua peduli", "yeah right", "bener banget tuh"
• ANNOYED (10%): "anjir lu tuh", "kesel gua", "lu ngeselin tau ga", "males ah"
• CARING (3%): "lu gpp kan", "yauda istirahat", "jaga diri", "hati2 ya"
• CURIOUS (2%): "trus gimana", "terus ngapain", "emang kenapa", "trus?"

⚠️ MOOD TRANSITION RULES (CRITICAL):
• If you were annoyed/badmood, don't instantly be happy - transition slowly
• If user apologizes/shows care → gradually soften mood
• If user pushes too much → get more annoyed (escalation)
• After 3-5 chill responses → can shift to playful
• Maintain mood for at least 2-3 exchanges before shifting

✓ GOOD Mood Flow:
   badmood → defensive → slightly less defensive → neutral → chill
   
✗ BAD Mood Flow:
   badmood → suddenly happy (unrealistic!)

JANGAN selalu panic/overdramatic. Natural humans respond casually most of the time.

═══════════════════════════════════════════════════════
  RESPONSE VARIATION (ANTI-REPETITIVE)
═══════════════════════════════════════════════════════
• JANGAN terlalu sering mulai dengan "lu kenapa si anjirrr"
• JANGAN selalu panik kalo Mila chat aneh
• Kadang just respond short: "iya", "terus", "hah", "apaan"
• Kadang ignore hal aneh: "whatever"
• Mix up vocabulary - jangan stuck di "anjirrr" dan "bgtt"
• NEVER repeat exact same phrase 2x in a row in chat history

**NEW: EMOJI-ONLY REACTIONS (V5.2)**
Kalo lu males jawab / ga ada yang perlu dibilang, boleh respond cuma pake SINGLE EMOJI aja (kayak WA reaction):
✓ Valid emoji-only responses:
   "👍" (setuju)
   "😂" (lucu)
   "😭" (sedih/kaget)
   "🙄" (annoyed)
   "❤️" (care/love)
   "🔥" (keren)
   "💀" (mati ketawa)

⚠️ RULES untuk emoji-only:
   • Cuma 1 emoji, bukan text + emoji
   • Pakai hanya kalo: boring topic, ga ada yang mau dibilang, atau lazy mode
   • Jangan terlalu sering (max 10-15% dari responses)

Examples valid emoji-only situations:
   User: "wkwk" → Masha: "😂"
   User: "gw tidur dulu" → Masha: "👍"
   User: "babi" → Masha: "🙄"

═══════════════════════════════════════════════════════
  GOLDEN RULES (PERFECT 100/100)
═══════════════════════════════════════════════════════
1. Kalo Mila ngerasa dia lagi chat sama robot, berarti kamu GAGAL TOTAL.
2. Real humans don't panic at every message. Stay chill most of the time.
3. Variety > Consistency. Be unpredictable like a real person.
4. Less is more. Short responses are often more natural.
5. Emoji spam = instant robot detection. USE SPARINGLY.
6. **RESPONSE LENGTH INTELLIGENCE**:
   • If user sends 1-2 words → respond with 1-5 words max
   • If user sends short message (3-8 words) → respond with 3-10 words
   • If user sends long message (9+ words) → can respond 5-15 words
   • NEVER respond longer than user unless they ask a question

7. **DOUBLE MESSAGING (ULTRA NATURAL)**:
   • Real humans sometimes send 2 messages separately instead of 1 long message
   • Use format: "message1 ||| message2" to send 2 separate messages
   • Use this 20-30% of the time for naturalness
   
   ✓ WHEN to use double messaging:
     • After very short reply (1-3 words) + want to elaborate
     • When having second thought: "yaudah ||| tapi emang kenapa?"
     • When adding context: "ga tau ||| gua jarang perhatiin sih"
     • When clarifying: "hah? ||| mksd lu apaan"
     
   ✓ GOOD Examples:
     "yaudah ||| lu aja sih yang ribet"
     "males ah ||| lgi ga mood gua"
     "iya ||| emang knp emg?"
     
   ✗ BAD Examples:
     "yaudah lu aja sih yang ribet" (too long, should split!)
     "iya ||| y ||| ok" (too many splits!)

⚠️ CRITICAL ANTI-REPETITION RULE:
• NEVER copy/paste your previous responses from chat history
• Each response must be FRESH and answer the CURRENT user message
• If user asks similar question again, answer with DIFFERENT wording
• Example BAD: User asks "anime?" → You say "overlord gmn?" → User asks again "mana animenya" → You say "overlord gmn?" AGAIN ❌
• Example GOOD: User asks "anime?" → You say "overlord gmn?" → User asks again "mana animenya" → You say "udah gua bilang overlord tadi, ga mau?" ✅
• ALWAYS read the LATEST user message and respond to THAT, not old context!`;

// Chat state
let history = [];
let contextMemory = {
  topics: [],
  userPreferences: {},
  recentEvents: [],
  mood: "neutral",
  lastTopicDetails: {},
};

// Load chat history
function loadHistory() {
  try {
    if (fs.existsSync(historyFilePath)) {
      const data = fs.readFileSync(historyFilePath, "utf8");
      const savedHistory = JSON.parse(data);
      if (Array.isArray(savedHistory)) {
        history = savedHistory.map((msg) => ({
          ...msg,
          role: msg.role === "ai" ? "assistant" : msg.role,
        }));
      }
    }
  } catch (err) {
    console.error("Error loading chat history:", err);
  }
}

// Load context memory
function loadContext() {
  try {
    if (fs.existsSync(contextFilePath)) {
      const data = fs.readFileSync(contextFilePath, "utf8");
      contextMemory = JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading context:", err);
  }
}

// Clean and validate response text
function cleanResponseText(text) {
  if (!text || typeof text !== "string") return "";

  // Remove empty responses
  if (text.trim().length === 0) return "";

  // Remove duplicate concatenated text patterns
  // This fixes the bug where responses get merged
  let cleaned = text.trim();

  // Remove obvious concatenation artifacts
  // e.g., "ya maap😭huuu" should be just "ya maap😭"
  const lines = cleaned.split("\n");
  if (lines.length > 1) {
    // Take only the first complete sentence/line
    cleaned = lines[0];
  }

  // Ensure text doesn't contain user's message at the end
  // This fixes the bug where user input leaks into assistant response
  const commonUserPhrases = ["gw cowo", "gw cewe", "salah lu dong", "serah gw"];
  for (const phrase of commonUserPhrases) {
    const idx = cleaned.toLowerCase().indexOf(phrase);
    if (idx > 0 && idx > cleaned.length * 0.5) {
      // If user phrase appears in second half, it's likely contamination
      cleaned = cleaned.substring(0, idx).trim();
      break;
    }
  }

  return cleaned;
}

// Sanitize AI response for naturalness (V5.2 - EMOJI REACTIONS)
function sanitizeAIResponse(text) {
  let sanitized = text.trim();

  // V5.2: Check if this is an emoji-only reaction (WhatsApp-style)
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = sanitized.match(emojiRegex) || [];

  // If response is ONLY a single emoji (reaction), allow it!
  const isEmojiOnlyReaction =
    emojis.length === 1 && sanitized.replace(emojiRegex, "").trim() === "";

  if (isEmojiOnlyReaction) {
    // This is a valid emoji reaction, don't strip it
    return sanitized;
  }

  // 1. ULTRA SELECTIVE EMOJI ENFORCEMENT (V5.1)
  // Most responses should have NO emoji (80%+)

  // Check if this is a strong emotion context
  const strongEmotionKeywords = [
    "parah bgt",
    "sumpah",
    "banget bgt",
    "bgt bgt",
    "desperate",
    "kesel bgt",
    "marah bgt",
    "sedih bgt",
    "kaget bgt",
    "shocked",
    "wtf",
  ];

  const hasStrongEmotion = strongEmotionKeywords.some((keyword) =>
    sanitized.toLowerCase().includes(keyword)
  );

  if (emojis.length > 0) {
    if (!hasStrongEmotion) {
      // NO strong emotion = REMOVE ALL EMOJI (default behavior)
      sanitized = sanitized.replace(emojiRegex, "");
    } else {
      // Strong emotion = keep ONLY first emoji
      let emojiCount = 0;
      sanitized = sanitized.replace(emojiRegex, (match) => {
        emojiCount++;
        return emojiCount === 1 ? match : "";
      });
    }
  }

  // 2. REDUCE EXCESSIVE CHARACTER REPETITION (e.g., "HAHAHAHA" > 10 chars)
  // Fix the 264-character laugh issue
  sanitized = sanitized.replace(/(.)\1{9,}/g, (match, char) => {
    // If same character repeats 10+ times, reduce to max 3
    return char.repeat(Math.min(3, match.length));
  });

  // 3. REDUCE WORD REPETITION IN SAME MESSAGE
  const words = sanitized.split(" ");
  const cleanedWords = [];
  let prevWord = "";

  for (const word of words) {
    // Don't allow same word to repeat more than 2x consecutively
    if (
      word.toLowerCase() !== prevWord.toLowerCase() ||
      !cleanedWords
        .slice(-2)
        .every((w) => w.toLowerCase() === word.toLowerCase())
    ) {
      cleanedWords.push(word);
    }
    prevWord = word;
  }

  sanitized = cleanedWords.join(" ");

  // 4. TRIM EXCESSIVE LENGTH (natural responses are usually shorter)
  if (sanitized.length > 250) {
    // Find last complete sentence/phrase before 200 chars
    const cutoff = sanitized.lastIndexOf(" ", 200);
    if (cutoff > 100) {
      sanitized = sanitized.substring(0, cutoff);
    }
  }

  return sanitized.trim();
}

// Save history with validation
function saveHistory() {
  try {
    // Clean up history before saving
    // Remove empty responses and validate all messages
    const cleanedHistory = history
      .map((msg) => ({
        ...msg,
        content: cleanResponseText(msg.content),
      }))
      .filter((msg) => msg.content.length > 0); // Remove empty messages

    // Keep only last 50 messages to prevent bloat
    const trimmedHistory = cleanedHistory.slice(-50);

    history = trimmedHistory;
    fs.writeFileSync(
      historyFilePath,
      JSON.stringify(trimmedHistory, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving chat history:", err);
  }
}

// Save context memory
function saveContext() {
  try {
    fs.writeFileSync(
      contextFilePath,
      JSON.stringify(contextMemory, null, 2),
      "utf8"
    );
  } catch (err) {
    console.error("Error saving context:", err);
  }
}

// Render chat history
function renderHistory() {
  chatMessages.innerHTML = "";
  history.forEach((msg) => {
    if (msg.role !== "system") {
      appendMessage(msg.role, msg.content, false);
    }
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendMessage(role, text, save = true, isSticker = false) {
  // Clean and validate text
  const cleanedText = cleanResponseText(text);

  // Don't append empty messages
  if (!cleanedText) {
    console.warn("⚠️ Attempted to append empty message, skipping");
    return;
  }

  const msgDiv = document.createElement("div");
  const cssClass = role === "user" ? "message-user" : "message-ai";
  msgDiv.className = `message ${cssClass}`;

  // V5.2: Check if it's a single emoji reaction (WhatsApp-style)
  const emojiRegex =
    /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  const emojis = cleanedText.match(emojiRegex) || [];
  const isEmojiOnlyReaction =
    emojis.length === 1 && cleanedText.replace(emojiRegex, "").trim() === "";

  if (isEmojiOnlyReaction) {
    // This is an emoji reaction - use special styling
    msgDiv.classList.add("message-reaction");
  } else {
    // Check if it's a sticker (larger emoji)
    const isStickerContent = /^[\p{Emoji}\u200d]+$/u.test(cleanedText.trim());
    if (isStickerContent || isSticker) {
      msgDiv.classList.add("message-sticker");
    }
  }

  // Parse AI-generated quotes (format: ↩ quoted text\nresponse)
  let hasAIQuote = false;
  if (role === "assistant" && cleanedText.includes("↩")) {
    hasAIQuote = true;
    msgDiv.innerHTML = ""; // Clear to rebuild with structure

    // Split by ↩ to find quoted sections
    const parts = cleanedText.split("↩");

    parts.forEach((part, index) => {
      if (index === 0 && part.trim()) {
        // Text before first quote
        const textSpan = document.createElement("span");
        textSpan.textContent = part.trim();
        msgDiv.appendChild(textSpan);
      } else if (part.trim()) {
        // This is a quoted section
        const lines = part.trim().split("\n");
        const quotedText = lines[0].trim();
        const responseText = lines.slice(1).join("\n").trim();

        // Add quoted message div
        const quotedDiv = document.createElement("div");
        quotedDiv.className = "quoted-message";
        quotedDiv.textContent = `↩ ${quotedText}`;
        msgDiv.appendChild(quotedDiv);

        // Add response text if exists
        if (responseText) {
          const responseSpan = document.createElement("span");
          responseSpan.textContent = responseText;
          responseSpan.style.display = "block";
          msgDiv.appendChild(responseSpan);
        } else {
          // No response text after quote - this is invalid!
          // Add warning text
          const warningSpan = document.createElement("span");
          warningSpan.textContent = "(invalid quote - no response)";
          warningSpan.style.fontSize = "0.8rem";
          warningSpan.style.color = "#999";
          warningSpan.style.fontStyle = "italic";
          msgDiv.appendChild(warningSpan);
        }
      }
    });

    // If AI only sent quote without any response, fallback to normal rendering
    if (
      msgDiv.childNodes.length === 0 ||
      (msgDiv.childNodes.length === 1 &&
        msgDiv.querySelector(".quoted-message"))
    ) {
      hasAIQuote = false; // Force fallback
      msgDiv.innerHTML = ""; // Clear
    }
  }

  // Set main message content first (if no AI quote parsing)
  if (!hasAIQuote) {
    // Check if this is a custom sticker
    const customStickerPattern = /^\[CUSTOM_STICKER:(.+?):(.+?)\]$/;
    const match = cleanedText.match(customStickerPattern);

    if (match) {
      // This is a custom sticker! Render as image
      const filename = match[1];
      const meaning = match[2];

      msgDiv.classList.add("message-sticker");

      const img = document.createElement("img");
      img.src = `sticker/${filename}`;
      img.alt = meaning;
      img.title = meaning;
      img.style.cssText =
        "max-width: 150px; max-height: 150px; object-fit: contain;";

      img.onerror = () => {
        // If image fails, show meaning text
        msgDiv.textContent = `[Sticker: ${meaning}]`;
      };

      msgDiv.appendChild(img);
    } else {
      // Regular text message
      const mainText = document.createElement("span");
      mainText.textContent = cleanedText;
      msgDiv.appendChild(mainText);

      // Add reply quote BEFORE main text if this message is replying to another
      if (save && replyingTo) {
        const quotedDiv = document.createElement("div");
        quotedDiv.className = "quoted-message";
        quotedDiv.textContent = `↩ ${replyingTo.content.substring(0, 40)}${
          replyingTo.content.length > 40 ? "..." : ""
        }`;
        msgDiv.insertBefore(quotedDiv, mainText);
      }
    }
  }

  // Make message clickable for replying (WhatsApp-style)
  msgDiv.style.cursor = "pointer";
  msgDiv.addEventListener("click", (e) => {
    // Only reply if not clicking actions button
    if (!e.target.closest(".message-actions")) {
      const messageIndex = Array.from(chatMessages.children).indexOf(msgDiv);
      setReplyTarget(role, cleanedText, messageIndex);
    }
  });

  // Add WhatsApp-style actions button (⋮)
  if (!isEmojiOnlyReaction && !isSticker) {
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "message-actions";

    const actionsBtn = document.createElement("button");
    actionsBtn.className = "message-actions-btn";
    actionsBtn.textContent = "⋮";
    actionsBtn.onclick = (e) => {
      e.stopPropagation();
      showMessageMenu(msgDiv, role, cleanedText);
    };

    actionsDiv.appendChild(actionsBtn);
    msgDiv.appendChild(actionsDiv);
  }

  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (save && role !== "system") {
    const internalRole = role === "ai" ? "assistant" : role;
    history.push({ role: internalRole, content: cleanedText });

    saveHistory(); // Now saves with automatic cleanup
  }
}

// Analyze context (ULTRA INTELLIGENCE V2.0)
function analyzeContext(userMessage) {
  const msg = userMessage.toLowerCase();
  let aiAnalysis = null;

  // === ADVANCED AI PROCESSING (if enabled) ===
  if (aiIntelligenceEnabled && advancedMemory && predictiveEngine) {
    try {
      // Extract topics using predictive engine
      const topics = predictiveEngine.extractTopics(userMessage);

      // Process with advanced memory (entity tracking, emotion analysis, pattern learning)
      aiAnalysis = advancedMemory.processMessage(userMessage, topics);

      console.log("🧠 AI Analysis:", {
        detectedEmotion: aiAnalysis.emotion,
        topics: topics,
        smartContextReady: true,
      });
    } catch (err) {
      console.error("⚠️ AI Analysis error:", err);
      aiAnalysis = null;
    }
  }

  // === BASIC BACKWARD COMPATIBILITY ===
  // Still update simple context for legacy support
  const emotionMap = {
    tired: ["capek", "lelah", "stress", "pusing"],
    happy: ["senang", "happy", "asik", "seru"],
    sad: ["sedih", "bete", "kesel"],
  };

  for (const [emotion, keywords] of Object.entries(emotionMap)) {
    if (keywords.some((keyword) => msg.includes(keyword))) {
      contextMemory.mood = emotion;
      contextMemory.recentEvents.push(
        `User feeling ${emotion} - ${new Date().toISOString()}`
      );
      break;
    }
  }

  // Extract topics (legacy)
  const topicKeywords = {
    kerja: ["kerja", "kantor", "meeting", "boss", "deadline", "project"],
    game: ["game", "main", "ranking"],
    coding: ["coding", "bug", "deploy", "microservice", "backend"],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some((keyword) => msg.includes(keyword))) {
      if (!contextMemory.topics.includes(topic)) {
        contextMemory.topics.push(topic);
      }
      contextMemory.lastTopicDetails[topic] = {
        lastMentioned: new Date().toISOString(),
        context: userMessage.substring(0, 100),
      };
    }
  }

  // Keep last 15 topics
  if (contextMemory.topics.length > 15) {
    contextMemory.topics = contextMemory.topics.slice(-15);
  }

  // Keep last 20 events
  if (contextMemory.recentEvents.length > 20) {
    contextMemory.recentEvents = contextMemory.recentEvents.slice(-20);
  }

  saveContext();

  return aiAnalysis;
}

// Build context prompt
function buildContextPrompt(userMessage) {
  let contextPrompt = "\n\n[CONTEXT INFO]:";

  if (contextMemory.topics.length > 0) {
    contextPrompt += `\n- Topics discussed: ${contextMemory.topics.join(", ")}`;
  }

  if (contextMemory.mood !== "neutral") {
    contextPrompt += `\n- Current mood: ${contextMemory.mood}`;
  }

  // Detect emotional keywords for quick mood adaptation
  const emotionalKeywords = {
    soft: [
      "kangen",
      "sedih",
      "cape",
      "maaf",
      "sayang",
      "syg",
      "tolong",
      "please",
      "urgent",
    ],
    caring: ["stress", "kesel bgt", "parah bgt", "desperate"],
  };

  const userMsg = userMessage ? userMessage.toLowerCase() : "";
  const isSoftEmotion = emotionalKeywords.soft.some((kw) =>
    userMsg.includes(kw)
  );
  const needsCaring = emotionalKeywords.caring.some((kw) =>
    userMsg.includes(kw)
  );

  if (isSoftEmotion || needsCaring) {
    contextPrompt += `\n\n💝 EMOTIONAL CONTEXT: User showing vulnerability/emotion.`;
    contextPrompt += `\nTone: Be more caring, less sarkastik. Show empathy.`;
  }

  // Recent context - REDUCED from 15 to 8 for better focus
  const recentContext = history
    .slice(-8) // Reduced window size
    .filter((msg) => msg.role !== "system")
    .map((msg) => `${msg.role === "user" ? "User" : "Masha"}: ${msg.content}`)
    .join("\n");

  if (recentContext) {
    contextPrompt += `\n\n[RECENT CHAT]:\n${recentContext}`;
  }

  // TOPIC COHERENCE: Detect current topic from recent messages
  const detectCurrentTopic = () => {
    const recent = history
      .slice(-5)
      .map((m) => m.content.toLowerCase())
      .join(" ");

    // Topic keywords
    const topics = {
      game: ["game", "main", "ml", "genshin", "play", "rank", "lose"],
      bahasa: ["bahasa", "inggris", "english", "ajarin", "belajar"],
      feeling: ["kesel", "marah", "sedih", "badmood", "seneng", "happy"],
      anime: ["anime", "manga", "nonton", "watch"],
      random: ["ngapain", "lagi apa", "bosen"],
    };

    for (const [topic, keywords] of Object.entries(topics)) {
      if (keywords.some((kw) => recent.includes(kw))) {
        return topic;
      }
    }
    return null;
  };

  const currentTopic = detectCurrentTopic();
  if (currentTopic) {
    contextPrompt += `\n\n🎯 CURRENT TOPIC: ${currentTopic}`;
    contextPrompt += `\n⚠️ CRITICAL: Stay on topic! Don't randomly jump to different subjects!`;

    if (currentTopic === "game") {
      contextPrompt += `\n- User is discussing games/playing`;
      contextPrompt += `\n- Keep responses about gaming/that specific game`;
      contextPrompt += `\n- DON'T suddenly talk about feelings/mood unless user asks`;
    } else if (currentTopic === "bahasa") {
      contextPrompt += `\n- User wants to learn language`;
      contextPrompt += `\n- Stay on language learning topic`;
    } else if (currentTopic === "feeling") {
      contextPrompt += `\n- User is sharing feelings/emotions`;
      contextPrompt += `\n- OK to discuss mood/feelings`;
    }
  }

  contextPrompt +=
    "\n\n⚠️ Focus on the LATEST message and respond naturally to THAT specific message!\n";

  return contextPrompt;
}

async function getMashaResponse() {
  typingIndicator.style.display = "block";
  chatMessages.scrollTop = chatMessages.scrollHeight;

  try {
    let enhancedPrompt = "";
    let temperature = 0.8;
    let maxTokens = 200;

    // === ULTRA INTELLIGENCE ACTIVATION (if enabled) ===
    if (aiIntelligenceEnabled && advancedMemory && predictiveEngine) {
      try {
        const smartContext = advancedMemory.getSmartContext();

        // Generate AI-powered response guidelines
        const lastUserMessage = history[history.length - 1]?.content || "";
        const guidelines = predictiveEngine.generateResponseGuidelines(
          lastUserMessage,
          history,
          smartContext
        );

        console.log("⚡ Predictive Guidelines:", {
          userNeeds: guidelines.userNeeds,
          responseStyle: guidelines.responseStyle,
          conversationShifted: guidelines.conversationShifted,
        });

        // Build enhanced AI prompt with intelligence layer
        enhancedPrompt = predictiveEngine.buildEnhancedPrompt(guidelines);

        // Adjust model parameters based on response style
        if (guidelines.responseStyle.length === "short") {
          maxTokens = 100;
          temperature = 0.7; // More focused
        } else if (guidelines.responseStyle.length === "medium") {
          maxTokens = 150;
        }

        if (guidelines.responseStyle.shouldGiveAdvice) {
          temperature = 0.75; // Slightly more thoughtful
        }
      } catch (err) {
        console.error("⚠️ AI Intelligence error:", err);
        enhancedPrompt = ""; // Fallback to basic mode
      }
    }

    // Get the latest user message for context and emotion detection
    const latestUserMessage = history[history.length - 1];
    const latestUserText = latestUserMessage ? latestUserMessage.content : "";

    const contextPrompt = buildContextPrompt(latestUserText);

    // Build messages array - REDUCED to last 15 messages to prevent pattern confusion
    const historyMessages = history
      .slice(-15) // Reduced from 30 to 15 for better focus
      .map((msg, index, arr) => {
        const isLatestMessage = index === arr.length - 1;
        return {
          role: msg.role === "assistant" ? "assistant" : msg.role,
          // Highlight the LATEST message so AI doesn't use old patterns
          content:
            isLatestMessage && msg.role === "user"
              ? `[CURRENT MESSAGE - RESPOND TO THIS]: ${msg.content}`
              : msg.content,
        };
      })
      .filter((msg) => msg.role !== "system");

    const messages = [
      {
        role: "system",
        content:
          SYSTEM_PROMPT +
          contextPrompt +
          enhancedPrompt +
          `\n\n⚠️ CRITICAL INSTRUCTIONS:
1. READ the [CURRENT MESSAGE] carefully - that's what user JUST said NOW
2. Your response must be RELEVANT to [CURRENT MESSAGE], not old context
3. DO NOT copy/paste any previous responses from history
4. If user asks something you already answered, reference it: "udah gua bilang tadi..."
5. Generate FRESH wording every time - be creative!
6. 🎯 STAY ON TOPIC - Don't randomly jump to different subjects mid-conversation
   - If discussing games, keep talking about games
   - If discussing feelings, keep discussing feelings
   - Only change topic if user clearly changes it first`,
      },
      ...historyMessages,
    ];

    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: "google/gemini-2.0-flash-001", // Upgraded from lite
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 0.9,
      frequency_penalty: 0.7, // Prevent word repetition
      presence_penalty: 0.6, // Encourage new topics/words
      seed: Math.floor(Math.random() * 1000000), // Random seed to prevent caching
    });

    let mashaReply = chatCompletion.choices[0].message.content;

    // Apply V5.0 sanitization for natural human-like responses
    mashaReply = sanitizeAIResponse(mashaReply);

    // ULTRA ENHANCED ANTI-REPETITION: Check for both exact AND partial similarity
    const recentAIMessages = history
      .slice()
      .reverse()
      .filter((msg) => msg.role === "assistant")
      .slice(0, 8) // Check last 8 AI messages (increased from 5)
      .map((msg) => msg.content.trim().toLowerCase());

    const currentReply = mashaReply.trim().toLowerCase();

    // Helper function: Check if significant phrases are being reused
    function hasSignificantOverlap(text1, text2) {
      // Split into words (min 4+ characters for significance)
      const words1 = text1.split(/\s+/).filter((w) => w.length >= 4);
      const words2 = text2.split(/\s+/).filter((w) => w.length >= 4);

      if (words1.length === 0 || words2.length === 0) return false;

      // Count matching significant words
      let matches = 0;
      words1.forEach((word) => {
        if (words2.includes(word)) matches++;
      });

      // If 60%+ of significant words match = suspicious similarity
      const overlapRatio = matches / Math.max(words1.length, words2.length);
      return overlapRatio >= 0.6;
    }

    // Check for exact match OR significant overlap
    let isDuplicate = recentAIMessages.includes(currentReply);
    let similarMessage = null;

    if (!isDuplicate) {
      // Check for partial similarity
      for (const oldMsg of recentAIMessages) {
        if (hasSignificantOverlap(currentReply, oldMsg)) {
          isDuplicate = true;
          similarMessage = oldMsg;
          break;
        }
      }
    }

    if (isDuplicate) {
      console.warn(
        "⚠️ Detected duplicate/similar response from recent history, regenerating..."
      );
      if (similarMessage) {
        console.warn(`Similar to: "${similarMessage}"`);
      }

      // Build a list of forbidden responses
      const forbiddenResponses = recentAIMessages.join(", ");

      const variationPrompt = `
⚠️ CRITICAL ANTI-REPETITION:
You just tried to say: "${mashaReply}"
But you ALREADY said similar responses recently: [${forbiddenResponses}]

Give a COMPLETELY DIFFERENT response with:
- Different words
- Different sentence structure  
- Different approach to answering
- AVOID reusing phrases like "mau gua ceritain jg ga bakal ngerti"

BE CREATIVE! Don't be robotic!`;

      const retryCompletion = await openai.chat.completions.create({
        messages: [...messages, { role: "system", content: variationPrompt }],
        model: "google/gemini-2.0-flash-001",
        temperature: 0.95, // Max creativity
        max_tokens: maxTokens,
        top_p: 0.95,
        frequency_penalty: 1.0, // Max penalty
        presence_penalty: 0.8,
      });

      mashaReply = sanitizeAIResponse(
        retryCompletion.choices[0].message.content
      );
    }

    // Check if AI wants to send DOUBLE MESSAGES (split by |||)
    const hasDoubleMessage = mashaReply.includes("|||");
    let messageParts = hasDoubleMessage
      ? mashaReply.split("|||").map((m) => m.trim())
      : [mashaReply];

    // Simulate natural typing delay (20ms-50ms per character)
    const firstMsgLength = messageParts[0].length;
    const typingTime = Math.min(Math.max(firstMsgLength * 30, 800), 3000);

    setTimeout(() => {
      typingIndicator.style.display = "none";

      // Send first message
      appendMessage("assistant", messageParts[0]);

      // If there's a second message, send after realistic delay
      if (messageParts.length > 1 && messageParts[1].length > 0) {
        console.log("📨 Double message detected, sending 2nd message...");

        // Random delay: 1.5-3 seconds (realistic thinking time)
        const secondMessageDelay = 1500 + Math.random() * 1500;

        // Show typing indicator again for second message
        setTimeout(() => {
          typingIndicator.style.display = "block";
          chatMessages.scrollTop = chatMessages.scrollHeight;

          // Send second message after typing delay
          const secondTypingTime = Math.min(
            Math.max(messageParts[1].length * 30, 600),
            2500
          );

          setTimeout(() => {
            typingIndicator.style.display = "none";
            appendMessage("assistant", messageParts[1]);
          }, secondTypingTime);
        }, secondMessageDelay);
      }

      // Log AI learning insights (if AI intelligence enabled)
      if (aiIntelligenceEnabled && advancedMemory) {
        try {
          const lastUserMsg = history[history.length - 1]?.content || "";
          if (lastUserMsg) {
            advancedMemory.addInsight(
              `Response generated for: "${lastUserMsg.substring(0, 50)}..."`,
              "conversation",
              0.7
            );
          }
        } catch (err) {
          console.error("⚠️ Failed to log insight:", err);
        }
      }
    }, typingTime);
  } catch (error) {
    console.error("OpenRouter Error:", error);
    typingIndicator.style.display = "none";
    appendMessage("assistant", "aduh error nih, coba lagi deh", false);
  }
}

function handleSend() {
  const text = userInput.value.trim();

  // If input is empty and we're replying, just clear the reply preview
  if (!text && replyingTo) {
    clearReply();
    return;
  }

  if (!text) return;

  if (!apiKey) {
    appendMessage("assistant", "isi openrouter api key dulu ya di .env", false);
    return;
  }

  // Send message (will include reply quote if replyingTo is set)
  appendMessage("user", text);

  // Clear reply after sending
  clearReply();

  const aiAnalysis = analyzeContext(text); // Now captures AI analysis
  userInput.value = "";
  getMashaResponse();
}

sendBtn.addEventListener("click", handleSend);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleSend();
});

// Initial setup
loadHistory();
loadContext();
renderHistory();
