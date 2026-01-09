// ========================================
// ADVANCED MEMORY SYSTEM
// Ultra Intelligent Context & Memory Management
// ========================================

const fs = require("fs");
const path = require("path");

class AdvancedMemory {
  constructor() {
    this.memoryPath = path.join(__dirname, "..", "advanced_memory.json");
    this.memory = this.loadMemory();
  }

  loadMemory() {
    try {
      if (fs.existsSync(this.memoryPath)) {
        const data = fs.readFileSync(this.memoryPath, "utf8");
        return JSON.parse(data);
      }
    } catch (err) {
      console.error("Error loading advanced memory:", err);
    }

    return {
      // === DEEP ENTITY TRACKING ===
      entities: {
        people: {}, // Track people mentioned: { name: { traits, relationship, lastMentioned } }
        places: {}, // Track places: { name: { context, frequency, lastMentioned } }
        things: {}, // Track objects/items mentioned
        events: {}, // Track events/activities
      },

      // === EMOTIONAL INTELLIGENCE ===
      emotionalProfile: {
        dominantMoods: [], // [{ mood, frequency, lastSeen }]
        triggers: {
          positive: [], // What makes user happy
          negative: [], // What stresses user
          neutral: [],
        },
        patterns: {
          morningMood: "unknown",
          afternoonMood: "unknown",
          eveningMood: "unknown",
          nightMood: "unknown",
        },
        responsePreferences: {
          longResponses: 0, // -10 to 10 scale
          joking: 0,
          supportive: 0,
          direct: 0,
        },
      },

      // === TOPIC INTELLIGENCE ===
      topicGraph: {
        // { topicName: { relatedTopics: [], frequency, sentiment, keywords: [], lastDetails: {} } }
      },

      // === CONVERSATION PATTERNS ===
      conversationPatterns: {
        averageMessageLength: 0,
        typingStyle: "unknown", // formal, casual, mixed
        commonPhrases: {}, // { phrase: frequency }
        questionFrequency: 0,
        responseTime: "medium",
        conversationStarters: [], // How they usually start conversations
      },

      // === GOALS & PROJECTS TRACKING ===
      activeGoals: [
        // { goal, startDate, mentions, progress, relatedTopics: [] }
      ],
      completedGoals: [],

      // === PREFERENCES & HABITS ===
      preferences: {
        favoriteTopics: [],
        avoidTopics: [],
        timePreferences: {
          // When they usually chat
          morning: 0,
          afternoon: 0,
          evening: 0,
          night: 0,
        },
      },

      // === RELATIONSHIP DYNAMICS ===
      relationship: {
        intimacyLevel: 5, // 1-10 scale
        trustLevel: 5,
        humor: 5,
        respectLevel: 10,
        conversationComfort: 5,
      },

      // === LEARNING LOG ===
      learningLog: [
        // { timestamp, insight, category, confidence }
      ],

      // === META INFO ===
      meta: {
        totalConversations: 0,
        totalMessages: 0,
        firstInteraction: new Date().toISOString(),
        lastInteraction: new Date().toISOString(),
        version: "2.0",
      },
    };
  }

  saveMemory() {
    try {
      fs.writeFileSync(
        this.memoryPath,
        JSON.stringify(this.memory, null, 2),
        "utf8"
      );
    } catch (err) {
      console.error("Error saving advanced memory:", err);
    }
  }

  // === ENTITY EXTRACTION & TRACKING ===
  extractEntities(message) {
    const entities = {
      people: [],
      places: [],
      things: [],
      events: [],
    };

    // Simple name detection (proper nouns)
    const words = message.split(" ");
    words.forEach((word, idx) => {
      // Capitalized words (potential names/places)
      if (/^[A-Z][a-z]+/.test(word) && idx > 0) {
        // Context-based classification
        const prevWord = words[idx - 1]?.toLowerCase();

        if (
          ["sama", "ke", "dari", "di", "temen", "teman", "orang"].includes(
            prevWord
          )
        ) {
          entities.people.push(word);
        } else if (["di", "ke", "dari", "lokasi"].includes(prevWord)) {
          entities.places.push(word);
        }
      }
    });

    // Event detection
    const eventKeywords = [
      "meeting",
      "deadline",
      "project",
      "acara",
      "kegiatan",
      "event",
    ];
    eventKeywords.forEach((keyword) => {
      if (message.toLowerCase().includes(keyword)) {
        entities.events.push(keyword);
      }
    });

    return entities;
  }

  trackEntities(message) {
    const entities = this.extractEntities(message);
    const timestamp = new Date().toISOString();

    // Track people
    entities.people.forEach((person) => {
      if (!this.memory.entities.people[person]) {
        this.memory.entities.people[person] = {
          firstMentioned: timestamp,
          mentions: 0,
          contexts: [],
          relationship: "unknown",
        };
      }
      this.memory.entities.people[person].mentions++;
      this.memory.entities.people[person].lastMentioned = timestamp;
      this.memory.entities.people[person].contexts.push(
        message.substring(0, 100)
      );

      // Keep last 5 contexts
      if (this.memory.entities.people[person].contexts.length > 5) {
        this.memory.entities.people[person].contexts =
          this.memory.entities.people[person].contexts.slice(-5);
      }
    });

    // Similar tracking for places, events
    entities.places.forEach((place) => {
      if (!this.memory.entities.places[place]) {
        this.memory.entities.places[place] = {
          firstMentioned: timestamp,
          mentions: 0,
          contexts: [],
        };
      }
      this.memory.entities.places[place].mentions++;
      this.memory.entities.places[place].lastMentioned = timestamp;
    });

    this.saveMemory();
    return entities;
  }

  // === EMOTIONAL INTELLIGENCE ===
  analyzeEmotion(message) {
    const msg = message.toLowerCase();
    const emotions = {
      happy: 0,
      sad: 0,
      angry: 0,
      anxious: 0,
      excited: 0,
      tired: 0,
      frustrated: 0,
      content: 0,
    };

    // Emotion keywords with weights
    const emotionPatterns = {
      happy: {
        keywords: [
          "senang",
          "happy",
          "asik",
          "seru",
          "mantap",
          "bagus",
          "yeay",
        ],
        weight: 1,
      },
      excited: {
        keywords: ["gila", "anjir", "wow", "amazing", "keren", "!!!"],
        weight: 1,
      },
      sad: { keywords: ["sedih", "bete", "down", "😭", "😢"], weight: 1 },
      angry: {
        keywords: ["kesel", "marah", "benci", "annoying", "😤", "😠"],
        weight: 1,
      },
      anxious: {
        keywords: ["cemas", "worry", "takut", "nervous", "deg"],
        weight: 1,
      },
      tired: {
        keywords: ["capek", "lelah", "tired", "exhausted", "pusing", "stress"],
        weight: 1,
      },
      frustrated: {
        keywords: ["frustasi", "ribet", "complicated", "susah"],
        weight: 1,
      },
      content: {
        keywords: ["santai", "chill", "relax", "oke", "fine"],
        weight: 0.5,
      },
    };

    for (const [emotion, data] of Object.entries(emotionPatterns)) {
      data.keywords.forEach((keyword) => {
        if (msg.includes(keyword)) {
          emotions[emotion] += data.weight;
        }
      });
    }

    // Find dominant emotion
    const dominant = Object.entries(emotions).sort((a, b) => b[1] - a[1])[0];

    if (dominant[1] > 0) {
      this.updateEmotionalProfile(dominant[0], message);
      return dominant[0];
    }

    return "neutral";
  }

  updateEmotionalProfile(emotion, context) {
    const timestamp = new Date().toISOString();
    const hour = new Date().getHours();

    // Track dominant moods
    const existingMood = this.memory.emotionalProfile.dominantMoods.find(
      (m) => m.mood === emotion
    );

    if (existingMood) {
      existingMood.frequency++;
      existingMood.lastSeen = timestamp;
    } else {
      this.memory.emotionalProfile.dominantMoods.push({
        mood: emotion,
        frequency: 1,
        lastSeen: timestamp,
      });
    }

    // Sort by frequency
    this.memory.emotionalProfile.dominantMoods.sort(
      (a, b) => b.frequency - a.frequency
    );

    // Keep top 10
    if (this.memory.emotionalProfile.dominantMoods.length > 10) {
      this.memory.emotionalProfile.dominantMoods =
        this.memory.emotionalProfile.dominantMoods.slice(0, 10);
    }

    // Track time-based patterns
    if (hour >= 5 && hour < 12) {
      this.memory.emotionalProfile.patterns.morningMood = emotion;
    } else if (hour >= 12 && hour < 17) {
      this.memory.emotionalProfile.patterns.afternoonMood = emotion;
    } else if (hour >= 17 && hour < 21) {
      this.memory.emotionalProfile.patterns.eveningMood = emotion;
    } else {
      this.memory.emotionalProfile.patterns.nightMood = emotion;
    }

    this.saveMemory();
  }

  // === TOPIC GRAPH INTELLIGENCE ===
  updateTopicGraph(topics, context, sentiment = "neutral") {
    const timestamp = new Date().toISOString();

    topics.forEach((topic) => {
      if (!this.memory.topicGraph[topic]) {
        this.memory.topicGraph[topic] = {
          relatedTopics: [],
          frequency: 0,
          sentiment: sentiment,
          keywords: [],
          firstMentioned: timestamp,
          lastDetails: {},
        };
      }

      this.memory.topicGraph[topic].frequency++;
      this.memory.topicGraph[topic].lastMentioned = timestamp;
      this.memory.topicGraph[topic].lastDetails = {
        context: context.substring(0, 150),
        timestamp: timestamp,
      };

      // Connect related topics
      topics.forEach((otherTopic) => {
        if (
          topic !== otherTopic &&
          !this.memory.topicGraph[topic].relatedTopics.includes(otherTopic)
        ) {
          this.memory.topicGraph[topic].relatedTopics.push(otherTopic);
        }
      });

      // Keep max 10 related topics
      if (this.memory.topicGraph[topic].relatedTopics.length > 10) {
        this.memory.topicGraph[topic].relatedTopics =
          this.memory.topicGraph[topic].relatedTopics.slice(-10);
      }
    });

    this.saveMemory();
  }

  // === CONVERSATION PATTERN ANALYSIS ===
  analyzeConversationPattern(message) {
    const msgLength = message.length;

    // Update average message length
    const currentAvg = this.memory.conversationPatterns.averageMessageLength;
    const totalMessages = this.memory.meta.totalMessages;

    this.memory.conversationPatterns.averageMessageLength =
      (currentAvg * totalMessages + msgLength) / (totalMessages + 1);

    // Detect typing style
    const formalWords = ["tolong", "terima kasih", "maaf", "permisi"];
    const casualWords = ["gua", "lu", "nih", "sih", "dong", "deh"];

    let formalCount = 0;
    let casualCount = 0;

    formalWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) formalCount++;
    });

    casualWords.forEach((word) => {
      if (message.toLowerCase().includes(word)) casualCount++;
    });

    if (casualCount > formalCount) {
      this.memory.conversationPatterns.typingStyle = "casual";
    } else if (formalCount > casualCount) {
      this.memory.conversationPatterns.typingStyle = "formal";
    } else {
      this.memory.conversationPatterns.typingStyle = "mixed";
    }

    // Track common phrases (3+ words)
    const phrases = message.match(/\b(\w+\s+\w+\s+\w+)\b/g);
    if (phrases) {
      phrases.forEach((phrase) => {
        const normalized = phrase.toLowerCase();
        if (!this.memory.conversationPatterns.commonPhrases[normalized]) {
          this.memory.conversationPatterns.commonPhrases[normalized] = 0;
        }
        this.memory.conversationPatterns.commonPhrases[normalized]++;
      });
    }

    // Track question frequency
    if (message.includes("?")) {
      this.memory.conversationPatterns.questionFrequency++;
    }

    this.saveMemory();
  }

  // === GOAL TRACKING ===
  detectGoals(message) {
    const msg = message.toLowerCase();
    const goalKeywords = [
      "mau",
      "pengen",
      "ingin",
      "rencana",
      "target",
      "goal",
      "harus",
      "akan",
      "planning",
      "bakal",
    ];

    const hasGoalIndicator = goalKeywords.some((keyword) =>
      msg.includes(keyword)
    );

    if (hasGoalIndicator) {
      const goal = {
        goal: message.substring(0, 200),
        startDate: new Date().toISOString(),
        mentions: 1,
        progress: "started",
        relatedTopics: [],
      };

      this.memory.activeGoals.push(goal);

      // Keep last 10 active goals
      if (this.memory.activeGoals.length > 10) {
        this.memory.activeGoals = this.memory.activeGoals.slice(-10);
      }

      this.saveMemory();
      return true;
    }

    return false;
  }

  // === LEARNING & INSIGHTS ===
  addInsight(insight, category, confidence = 0.8) {
    this.memory.learningLog.push({
      timestamp: new Date().toISOString(),
      insight: insight,
      category: category,
      confidence: confidence,
    });

    // Keep last 50 insights
    if (this.memory.learningLog.length > 50) {
      this.memory.learningLog = this.memory.learningLog.slice(-50);
    }

    this.saveMemory();
  }

  // === GET SMART CONTEXT ===
  getSmartContext() {
    const context = {
      recentTopics: [],
      emotionalState: "neutral",
      relationshipLevel: this.memory.relationship.intimacyLevel,
      preferences: [],
      activeGoals: [],
      insights: [],
    };

    // Get top 5 recent topics
    const sortedTopics = Object.entries(this.memory.topicGraph)
      .sort((a, b) => {
        const aTime = new Date(a[1].lastMentioned || 0);
        const bTime = new Date(b[1].lastMentioned || 0);
        return bTime - aTime;
      })
      .slice(0, 5);

    context.recentTopics = sortedTopics.map(([topic, data]) => ({
      topic,
      lastContext: data.lastDetails.context,
    }));

    // Get emotional state
    if (this.memory.emotionalProfile.dominantMoods.length > 0) {
      context.emotionalState =
        this.memory.emotionalProfile.dominantMoods[0].mood;
    }

    // Get top preferences
    context.preferences = this.memory.preferences.favoriteTopics.slice(0, 3);

    // Get active goals
    context.activeGoals = this.memory.activeGoals.slice(-3);

    // Get recent insights
    context.insights = this.memory.learningLog.slice(-5);

    return context;
  }

  // === UPDATE META ===
  updateMeta() {
    this.memory.meta.totalMessages++;
    this.memory.meta.lastInteraction = new Date().toISOString();
    this.saveMemory();
  }

  // === MAIN PROCESS METHOD ===
  processMessage(message, topics = []) {
    this.trackEntities(message);
    const emotion = this.analyzeEmotion(message);
    this.analyzeConversationPattern(message);
    this.detectGoals(message);

    if (topics.length > 0) {
      this.updateTopicGraph(topics, message, emotion);
    }

    this.updateMeta();

    return {
      emotion,
      smartContext: this.getSmartContext(),
    };
  }
}

module.exports = AdvancedMemory;
