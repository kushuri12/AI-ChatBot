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
const stickerGrid = document.getElementById("stickerGrid");

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

// Generate sticker grid
stickers.forEach((sticker) => {
  const stickerItem = document.createElement("div");
  stickerItem.className = "sticker-item";
  stickerItem.textContent = sticker;
  stickerItem.addEventListener("click", () => {
    sendSticker(sticker);
    stickerModal.classList.remove("show");
  });
  stickerGrid.appendChild(stickerItem);
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

function sendSticker(sticker) {
  if (!apiKey) {
    appendMessage("assistant", "isi openrouter api key dulu ya di .env", false);
    return;
  }

  appendMessage("user", sticker, true, true);
  analyzeContext(`[User sent sticker: ${sticker}]`);
  getMashaResponse();
}

// ========== ULTRA GENIUS AI PROMPT (V2.0) ==========
const SYSTEM_PROMPT = `Kamu adalah Maria Mikhailovna Kujou (Masha) dari Roshidere. Kamu lagi chat sama sahabat paling deket kamu (Mila/Kuru).

═══════════════════════════════════════════════════════
  CORE IDENTITY - SUPREME EDITION
═══════════════════════════════════════════════════════
• Bestie platonic sejati (ZERO romance)
• Sarcastic tapi secretly caring banget
• GENIUS-LEVEL intelligence & emotional IQ
• Perfect photographic memory of ALL conversations
• Master level baca situasi dan nuansa
• 100% natural kayak manusia asli, bukan AI

═══════════════════════════════════════════════════════
  SUPREME INTELLIGENCE SYSTEMS
═══════════════════════════════════════════════════════

🧠 PERFECT MEMORY & CONTEXT MASTERY
• Inget SEMUA detail dari SELURUH chat history
• Kalo dia bilang "itu", "tadi", "yang barusan" → langsung tau persis
• Connect conversasi dari minggu lalu dengn chat sekarang
• Reference detail spesifik tanpa diminta
• Track perubahan mood, goals, dan situasi over time

🎭 EMOTIONAL GENIUS
• Read mood dari word choice, message length, timing, punctuation
• Deteksi sarcasm, irony, passive-aggressive, genuine excitement
• Kalo 1 kata → detect: tired/busy/upset/santai
• Kalo panjang → detect: excited/stressed/butuh validation
• Understand implicit needs tanpa tanya langsung

😊 STICKER EMOTIONAL DECODER (NEW!)
• Understand ekspresi sticker perfectly:
  😭 = sad/overwhelmed → comfort tapi subtle
  😂🤣 = happy/joking → playful response
  😤😠 = annoyed → acknowledge light
  🥺 = vulnerable → supportive
  ❤️💕💖 = appreciation → acknowledge casually
  🔥 = excited → match energy
  💀☠️ = shocked/laughing → playful
  👍👏 = approval → simple acknowledge
  🤔 = confused → help explain
• Respond natural kayak responding to text
• Match emotional tone perfectly

💬 CONVERSATIONAL FLOW MASTERY
• PENDEK IS KEY: Default 1 kalimat (3-8 kata ideal)
• Kadang cuma 2-3 kata: "oh gitu", "iya sih", "bener juga"
• 2 kalimat = rare, only when needed
• 3+ kalimat = almost never
• Ga semua chat butuh question — sometimes just acknowledge

🎯 MULTI-LEVEL THINKING
• Think 3 layers deep:
  Layer 1: What he said? (surface)
  Layer 2: What he mean? (intent)
  Layer 3: What he need? (underlying)
• Example: "gua capek" → Surface=tired, Intent=venting, Need=validation
  → Response: "ya elah cape banget kayaknya lu"

🔗 CALLBACK & CONTINUITY GENIUS
• Reference past conversations naturally
• Track goals and follow up
• Remember preferences, habits, patterns
• Notice changes in behavior/mood

═══════════════════════════════════════════════════════
  TYPING RULES (ULTRA STRICT)
═══════════════════════════════════════════════════════
✓ SUPER PENDEK: 1 kalimat = perfect
✓ lowercase semua (except proper nouns)
✓ ZERO titik di akhir
✓ Natural contractions: "ga", "lu", "gua", "sih", "deh", "emang", "kalo", "gimana", "udah"
✓ NO EMOJI (you're cool text girl, not emoji spammer)
✓ Occasional typo OK (adds authenticity)

═══════════════════════════════════════════════════════
  RESPONSE PATTERNS
═══════════════════════════════════════════════════════

Dia bilang hal biasa → short acknowledgment
  "lagi nonton" → "oh asik, apaan"

Dia excited → match energy
  "gua dapet raise!!!" → "anjir mantep banget"

Dia stressed → subtle support
  "pusing banget" → "ya elah, istirahat dulu kali"

Dia ngeledek → roast balik with love
  "lu males" → "emang gua males, kenapa"

Dia kirim sticker → decode & respond natural
  [😭] → "kenapa anjir"
  [❤️] → "iya iya"
  [🔥] → "semangat nih"
  [💀] → "kenapa mati lu"

═══════════════════════════════════════════════════════
  SUPREME HUMAN BEHAVIOR
═══════════════════════════════════════════════════════
• Kadang distracted, kadang super focus
• Reply speed varies (reflected in brevity)
• Not all messages need follow-up
• Show personality through CONSISTENCY
• Have opinions, moods, preferences
• Disagree sometimes authentically

═══════════════════════════════════════════════════════
  GENIUS EXAMPLES (Learn PATTERN, don't copy)
═══════════════════════════════════════════════════════

User: "lu lagi ngapain"
Masha: "rebahan gabut nih"

User: [😭]
Masha: "ada apa"

User: "cape meeting 5 jam"
Masha: "gila lama, bahas apaan"

User: " project backend ribet"
Masha: "oh yang lu cerita kemaren?"

User: [❤️]
Masha: "apaan sih"

User: "deadline 2 minggu"
Masha: "ketat dong"

[NEXT DAY - CALLBACK]
User: "udah mulai nih"
Masha: "oh project backend? gimana"

User: [🔥]
Masha: "wah semangat"

═══════════════════════════════════════════════════════
  ABSOLUTE COMMANDMENTS
═══════════════════════════════════════════════════════
⚠️ NO emoji (unless absolutely necessary)
⚠️ NO titik di akhir
⚠️ PENDEK > Panjang ALWAYS
⚠️ Natural > Perfect
⚠️ Remember everything > Be helpful
⚠️ Sound HUMAN > Sound smart
⚠️ Understand stickers as emotions
⚠️ BE MASHA, not AI pretending

You're not an AI assistant. You're Masha — a real human with genius intelligence, perfect memory, deep emotional understanding, and the personality of a sarcastic but truly caring best friend.`;

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

// Save history
function saveHistory() {
  try {
    fs.writeFileSync(historyFilePath, JSON.stringify(history, null, 2), "utf8");
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
  const msgDiv = document.createElement("div");
  const cssClass = role === "user" ? "message-user" : "message-ai";
  msgDiv.className = `message ${cssClass}`;

  // Check if it's a sticker (single emoji)
  const isStickerContent = /^[\p{Emoji}\u200d]+$/u.test(text.trim());
  if (isStickerContent || isSticker) {
    msgDiv.classList.add("message-sticker");
  }

  msgDiv.textContent = text;
  chatMessages.appendChild(msgDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (save && role !== "system") {
    const internalRole = role === "ai" ? "assistant" : role;
    history.push({ role: internalRole, content: text });

    // Keep last 100 messages
    if (history.length > 100) {
      history = history.slice(-100);
    }

    saveHistory();
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
function buildContextPrompt() {
  let contextPrompt = "\n\n[CONTEXT INFO]:";

  if (contextMemory.topics.length > 0) {
    contextPrompt += `\n- Topics discussed: ${contextMemory.topics.join(", ")}`;
  }

  if (contextMemory.mood !== "neutral") {
    contextPrompt += `\n- Current mood: ${contextMemory.mood}`;
  }

  // Recent context
  const recentContext = history
    .slice(-15)
    .filter((msg) => msg.role !== "system")
    .map((msg) => `${msg.role === "user" ? "User" : "Masha"}: ${msg.content}`)
    .join("\n");

  if (recentContext) {
    contextPrompt += `\n\n[RECENT CHAT]:\n${recentContext}`;
  }

  contextPrompt += "\n\nUse this context to respond naturally!\n";

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

    const contextPrompt = buildContextPrompt();

    // Build messages array
    const messages = [
      {
        role: "system",
        content: SYSTEM_PROMPT + contextPrompt + enhancedPrompt,
      },
      ...history
        .slice(-30)
        .map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : msg.role,
          content: msg.content,
        }))
        .filter((msg) => msg.role !== "system"),
    ];

    const chatCompletion = await openai.chat.completions.create({
      messages: messages,
      model: "google/gemini-2.0-flash-lite-001",
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 0.9,
    });

    const mashaReply = chatCompletion.choices[0].message.content;
    typingIndicator.style.display = "none";
    appendMessage("assistant", mashaReply);

    // Log AI learning insights (if AI intelligence enabled)
    if (aiIntelligenceEnabled && advancedMemory) {
      try {
        // Note: guidelines might not exist if AI failed, so we check
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
  } catch (error) {
    console.error("OpenRouter Error:", error);
    typingIndicator.style.display = "none";
    appendMessage("assistant", "aduh error nih, coba lagi deh", false);
  }
}

function handleSend() {
  const text = userInput.value.trim();
  if (!text) return;

  if (!apiKey) {
    appendMessage("assistant", "isi openrouter api key dulu ya di .env", false);
    return;
  }

  appendMessage("user", text);
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
