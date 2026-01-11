// ========================================
// Contextual Awareness & Subtext Detection
// ========================================

class ContextualAwareness {
  constructor() {
    this.emotionalKeywords = {
      happy: ["seneng", "happy", "seru", "asik", "bagus", "keren"],
      sad: ["sedih", "down", "galau", "bete"],
      angry: ["kesel", "marah", "benci", "annoying", "nyebelin"],
      frustrated: ["capek", "males", "bosen", "jenuh"],
      excited: ["gila", "mantap", "wow", "anjir bagus", "keren bgt"],
      anxious: ["takut", "khawatir", "worried", "nervous"],
    };

    this.topicIndicators = {
      game: ["game", "main", "play", "rank", "lose", "win", "ml", "genshin"],
      study: ["belajar", "tugas", "sekolah", "ujian", "test", "pr"],
      relationship: ["pacar", "crush", "suka", "cinta", "temen"],
      food: ["makan", "lapar", "food", "makanan"],
      hobby: ["hobby", "hobi", "nonton", "anime", "movie"],
    };
  }

  // Detect user's emotional state from message
  detectEmotion(message) {
    const lowerMsg = message.toLowerCase();

    for (const [emotion, keywords] of Object.entries(this.emotionalKeywords)) {
      if (keywords.some((kw) => lowerMsg.includes(kw))) {
        return emotion;
      }
    }

    // Check punctuation/caps for intensity
    if (message.includes("!!") || message.includes("!!!")) {
      return "excited";
    }
    if (message.match(/[A-Z]{3,}/)) {
      return "angry";
    }

    return "neutral";
  }

  // Detect current conversation topic
  detectTopic(history) {
    const recentMessages = history.slice(-5);
    const combinedText = recentMessages
      .map((m) => m.content)
      .join(" ")
      .toLowerCase();

    const topicScores = {};

    for (const [topic, keywords] of Object.entries(this.topicIndicators)) {
      const score = keywords.reduce((acc, kw) => {
        const matches = (combinedText.match(new RegExp(kw, "gi")) || []).length;
        return acc + matches;
      }, 0);
      topicScores[topic] = score;
    }

    const maxScore = Math.max(...Object.values(topicScores));
    if (maxScore === 0) return null;

    return Object.keys(topicScores).find(
      (topic) => topicScores[topic] === maxScore
    );
  }

  // Detect if user is asking a question (beyond just "?")
  isQuestion(message) {
    const lowerMsg = message.toLowerCase();

    const questionWords = [
      "apa",
      "kenapa",
      "gimana",
      "kapan",
      "dimana",
      "siapa",
      "what",
      "why",
      "how",
      "when",
      "where",
      "who",
      "bisa",
      "mau",
      "tau",
    ];

    // Check for question mark
    if (message.includes("?")) return true;

    // Check for question words at start
    const firstWord = lowerMsg.split(/\s+/)[0];
    if (questionWords.includes(firstWord)) return true;

    // Check for common question patterns
    const questionPatterns = [
      /lu (tau|tahu|ngerti)/i,
      /gua (bisa|boleh|mau)/i,
      /(apa|kenapa|gimana)\s+/i,
    ];

    return questionPatterns.some((pattern) => pattern.test(message));
  }

  // Detect sarcasm/mockery
  detectSarcasm(message) {
    const sarcasmIndicators = [
      /wah (hebat|keren|mantap) (bgt|banget)/i,
      /ya (iya|iyalah|emang)/i,
      /lucu (bgt|banget)/i,
      /😂.*😂/,
      /wkwk.*wkwk/,
    ];

    return sarcasmIndicators.some((pattern) => pattern.test(message));
  }

  // Analyze user intent (what do they REALLY want?)
  analyzeIntent(message, history) {
    const intent = {
      type: "unknown",
      confidence: 0,
      subtext: null,
    };

    // Check for greeting
    if (/^(halo|hai|hi|yo|woi|p)\s*$/i.test(message.trim())) {
      intent.type = "greeting";
      intent.confidence = 0.9;
      intent.subtext = "User wants attention or to start conversation";
      return intent;
    }

    // Check for dismissive
    if (/^(yaudah|terserah|whatever|ga penting)\s*/i.test(message)) {
      intent.type = "dismissive";
      intent.confidence = 0.8;
      intent.subtext = "User is ending or avoiding topic";
      return intent;
    }

    // Check for seeking help
    if (this.isQuestion(message) && message.includes("gimana")) {
      intent.type = "seeking_advice";
      intent.confidence = 0.7;
      intent.subtext = "User needs guidance or opinion";
      return intent;
    }

    // Check for venting
    if (
      this.detectEmotion(message) === "angry" ||
      this.detectEmotion(message) === "frustrated"
    ) {
      intent.type = "venting";
      intent.confidence = 0.6;
      intent.subtext = "User wants to express frustration";
      return intent;
    }

    return intent;
  }

  // Detect conversation pattern (are they testing you? being playful? serious?)
  detectConversationMode(history) {
    if (history.length < 3) return "normal";

    const recent = history.slice(-5);

    // Check for repetitive short messages (testing/trolling)
    const shortMessages = recent.filter(
      (m) => m.content.split(/\s+/).length <= 2
    );
    if (shortMessages.length >= 4) return "testing";

    // Check for consistent sarcasm
    const sarcasticMessages = recent.filter((m) =>
      this.detectSarcasm(m.content)
    );
    if (sarcasticMessages.length >= 3) return "playful_sarcastic";

    // Check for serious topic discussion
    const currentTopic = this.detectTopic(recent);
    const avgMessageLength =
      recent.reduce((acc, m) => acc + m.content.split(/\s+/).length, 0) /
      recent.length;

    if (currentTopic && avgMessageLength > 8) return "serious_discussion";

    return "normal";
  }

  // Build smart context summary
  buildContextSummary(history) {
    const topic = this.detectTopic(history);
    const mode = this.detectConversationMode(history);
    const latestEmotion =
      history.length > 0
        ? this.detectEmotion(history[history.length - 1].content)
        : "neutral";

    return {
      topic,
      mode,
      latestEmotion,
      messageCount: history.length,
      recommendation: this.getRecommendation(topic, mode, latestEmotion),
    };
  }

  // Get AI response recommendation based on context
  getRecommendation(topic, mode, emotion) {
    const recommendations = {
      testing:
        "User might be testing/trolling. Be chill, don't overreact. Can call them out playfully.",
      playful_sarcastic:
        "Match their energy. Be sarcastic back, keep it light and fun.",
      serious_discussion:
        "Stay focused on topic. Give thoughtful responses. Don't joke around too much.",
      normal: "Be natural. Mix casual and engaged responses.",
    };

    return recommendations[mode] || recommendations.normal;
  }
}

module.exports = ContextualAwareness;
