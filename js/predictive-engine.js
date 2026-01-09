// ========================================
// PREDICTIVE INTELLIGENCE ENGINE
// Anticipate user needs & generate smart responses
// ========================================

class PredictiveEngine {
  constructor(advancedMemory) {
    this.memory = advancedMemory;
  }

  // === PREDICT USER NEEDS ===
  predictUserNeeds(currentMessage, conversationHistory) {
    const predictions = {
      needsSupport: false,
      needsAdvice: false,
      needsValidation: false,
      needsDistraction: false,
      needsInformation: false,
      wantsToVent: false,
      wantsToCelebrate: false,
      confidence: 0,
    };

    const msg = currentMessage.toLowerCase();
    const emotion = this.memory.analyzeEmotion(currentMessage);

    // Analyze based on emotion + keywords
    if (["sad", "anxious", "frustrated", "tired"].includes(emotion)) {
      predictions.needsSupport = true;
      predictions.confidence = 0.8;

      // Check if venting (longer message + emotional)
      if (currentMessage.length > 100) {
        predictions.wantsToVent = true;
        predictions.confidence = 0.9;
      }
    }

    if (["happy", "excited"].includes(emotion)) {
      predictions.wantsToCelebrate = true;
      predictions.needsValidation = true;
      predictions.confidence = 0.85;
    }

    // Detect question patterns
    if (
      msg.includes("?") ||
      msg.match(/\b(gimana|bagaimana|kenapa|apa|siapa)\b/)
    ) {
      predictions.needsInformation = true;
      predictions.confidence = 0.9;
    }

    // Detect advice-seeking
    if (msg.match(/\b(sebaiknya|enaknya|mending|should|better)\b/)) {
      predictions.needsAdvice = true;
      predictions.confidence = 0.85;
    }

    // Pattern: repeated frustration
    const recentFrustration = conversationHistory
      .slice(-5)
      .filter((m) => m.role === "user")
      .some((m) =>
        m.content.toLowerCase().match(/\b(ribet|susah|pusing|stress)\b/)
      );

    if (recentFrustration && predictions.needsSupport) {
      predictions.needsDistraction = true;
      predictions.confidence = 0.75;
    }

    return predictions;
  }

  // === GENERATE CONTEXTUAL INSIGHT ===
  generateContextInsight(smartContext) {
    const insights = [];

    // Topic trends
    if (smartContext.recentTopics.length > 0) {
      const topTopic = smartContext.recentTopics[0].topic;
      insights.push({
        type: "topic_focus",
        content: `User frequently discusses: ${topTopic}`,
        relevance: 0.8,
      });
    }

    // Emotional pattern
    if (smartContext.emotionalState !== "neutral") {
      insights.push({
        type: "emotional_state",
        content: `Current mood: ${smartContext.emotionalState}`,
        relevance: 0.9,
      });
    }

    // Active goals
    if (smartContext.activeGoals.length > 0) {
      insights.push({
        type: "active_goals",
        content: `User has ${smartContext.activeGoals.length} active goal(s)`,
        relevance: 0.7,
      });
    }

    return insights;
  }

  // === PREDICT BEST RESPONSE STYLE ===
  predictResponseStyle(userNeeds, conversationPatterns, emotion) {
    const style = {
      length: "short", // short, medium, long
      tone: "casual", // casual, supportive, playful, serious
      shouldAskQuestion: false,
      shouldGiveAdvice: false,
      shouldValidate: false,
      shouldJoke: false,
      shouldBeDirective: false,
    };

    // Adjust based on user needs
    if (userNeeds.wantsToVent) {
      style.length = "short";
      style.tone = "supportive";
      style.shouldValidate = true;
      style.shouldAskQuestion = false; // Let them vent
    }

    if (userNeeds.needsAdvice) {
      style.length = "medium";
      style.tone = "casual";
      style.shouldGiveAdvice = true;
    }

    if (userNeeds.wantsToCelebrate) {
      style.tone = "playful";
      style.shouldValidate = true;
      style.shouldJoke = false; // Be genuine
    }

    if (userNeeds.needsDistraction) {
      style.tone = "playful";
      style.shouldJoke = true;
      style.shouldAskQuestion = true;
    }

    if (userNeeds.needsInformation) {
      style.length = "medium";
      style.tone = "casual";
      style.shouldAskQuestion = false;
      style.shouldBeDirective = true;
    }

    // Adjust based on typing style
    if (conversationPatterns.typingStyle === "formal") {
      style.tone = "supportive"; // Slightly less casual
    }

    // Adjust based on emotion
    if (["tired", "frustrated"].includes(emotion)) {
      style.length = "short"; // Don't overwhelm
      style.shouldJoke = false;
    }

    return style;
  }

  // === SMART TOPIC CONTINUATION ===
  suggestTopicContinuation(recentTopics, topicGraph) {
    if (recentTopics.length === 0) return null;

    const latestTopic = recentTopics[0].topic;
    const topicData = topicGraph[latestTopic];

    if (!topicData) return null;

    // Find related topics
    if (topicData.relatedTopics.length > 0) {
      return {
        suggestion: `ask about ${topicData.relatedTopics[0]}`,
        confidence: 0.6,
      };
    }

    return null;
  }

  // === DETECT CONVERSATION SHIFT ===
  detectConversationShift(currentMessage, recentTopics) {
    if (recentTopics.length === 0) return false;

    const currentTopics = this.extractTopics(currentMessage);
    const recentTopicNames = recentTopics.map((t) => t.topic);

    // Check if any current topics overlap with recent
    const hasOverlap = currentTopics.some((topic) =>
      recentTopicNames.includes(topic)
    );

    return !hasOverlap; // True if topics changed
  }

  extractTopics(message) {
    const topics = [];
    const msg = message.toLowerCase();

    const topicKeywords = {
      kerja: [
        "kerja",
        "kantor",
        "meeting",
        "boss",
        "deadline",
        "project",
        "kerjaan",
      ],
      coding: ["coding", "bug", "deploy", "code", "programming", "developer"],
      game: ["game", "main", "ranking", "play"],
      health: ["sakit", "sehat", "olahraga", "gym", "exercise"],
      food: ["makan", "lapar", "food", "resto", "masak"],
      relationship: ["pacar", "gebetan", "crush", "teman", "friend"],
      hobby: ["hobi", "hobby", "nonton", "baca", "music"],
      study: ["belajar", "kuliah", "tugas", "assignment", "study"],
    };

    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some((keyword) => msg.includes(keyword))) {
        topics.push(topic);
      }
    }

    return topics;
  }

  // === GENERATE RESPONSE GUIDELINES ===
  generateResponseGuidelines(message, history, smartContext) {
    const userNeeds = this.predictUserNeeds(message, history);
    const responseStyle = this.predictResponseStyle(
      userNeeds,
      this.memory.memory.conversationPatterns,
      smartContext.emotionalState
    );

    const conversationShifted = this.detectConversationShift(
      message,
      smartContext.recentTopics
    );

    const topicSuggestion = this.suggestTopicContinuation(
      smartContext.recentTopics,
      this.memory.memory.topicGraph
    );

    return {
      userNeeds,
      responseStyle,
      conversationShifted,
      topicSuggestion,
      smartContext,
    };
  }

  // === BUILD ENHANCED PROMPT ===
  buildEnhancedPrompt(guidelines) {
    let prompt = "\n\n[ULTRA INTELLIGENCE MODE ACTIVATED]\n";

    // User emotional state
    if (guidelines.smartContext.emotionalState !== "neutral") {
      prompt += `\n🎭 DETECTED EMOTION: ${guidelines.smartContext.emotionalState.toUpperCase()}`;
    }

    // User needs
    const activeNeeds = Object.entries(guidelines.userNeeds)
      .filter(([key, value]) => value === true && key !== "confidence")
      .map(([key]) => key);

    if (activeNeeds.length > 0) {
      prompt += `\n💡 USER NEEDS: ${activeNeeds.join(", ")}`;
    }

    // Response style guidance
    prompt += `\n\n📝 RESPONSE STYLE:`;
    prompt += `\n- Length: ${guidelines.responseStyle.length.toUpperCase()}`;
    prompt += `\n- Tone: ${guidelines.responseStyle.tone}`;

    if (guidelines.responseStyle.shouldValidate) {
      prompt += `\n- ✓ VALIDATE their feelings/achievement`;
    }
    if (guidelines.responseStyle.shouldGiveAdvice) {
      prompt += `\n- ✓ Give subtle advice`;
    }
    if (guidelines.responseStyle.shouldJoke) {
      prompt += `\n- ✓ Be playful/funny`;
    }
    if (!guidelines.responseStyle.shouldAskQuestion) {
      prompt += `\n- ✗ Don't ask questions (let them talk)`;
    }

    // Recent context
    if (guidelines.smartContext.recentTopics.length > 0) {
      prompt += `\n\n🔄 RECENT CONTEXT:`;
      guidelines.smartContext.recentTopics.slice(0, 2).forEach((topic) => {
        prompt += `\n- ${topic.topic}: "${topic.lastContext}"`;
      });
    }

    // Active goals awareness
    if (guidelines.smartContext.activeGoals.length > 0) {
      prompt += `\n\n🎯 ACTIVE GOALS (reference if relevant):`;
      guidelines.smartContext.activeGoals.forEach((goal, idx) => {
        prompt += `\n${idx + 1}. ${goal.goal.substring(0, 80)}...`;
      });
    }

    // Conversation shift notice
    if (guidelines.conversationShifted) {
      prompt += `\n\n⚠️ TOPIC SHIFT DETECTED - User changed subject, acknowledge naturally`;
    }

    // Insights
    if (guidelines.smartContext.insights.length > 0) {
      prompt += `\n\n💎 LEARNED INSIGHTS:`;
      guidelines.smartContext.insights.slice(0, 3).forEach((insight) => {
        prompt += `\n- ${insight.insight}`;
      });
    }

    prompt += `\n\n⚡ RESPOND AS MASHA WITH SUPREME INTELLIGENCE!\n`;

    return prompt;
  }
}

module.exports = PredictiveEngine;
