// ========================================
// Human-Like Response Intelligence Module
// ========================================

class HumanResponseIntelligence {
  constructor() {
    this.responsePatterns = {
      agreement: ["iya", "bener", "emang", "ya gitu", "setuju"],
      disagreement: ["ga juga", "ga ah", "bukan gitu", "salah lu"],
      confusion: ["hah?", "mksd lu?", "apaan si", "ga ngerti"],
      acknowledgment: ["oh gitu", "oke deh", "yaudah", "sip"],
      curiosity: ["trus?", "terus gimana?", "trs knp?", "trus?"],
      dismissive: ["terserah", "yaudah", "whatever", "bebas"],
      annoyed: ["kesel gua", "males ah", "anjir", "bodo amat"],
    };
  }

  // Detect if AI is about to echo user's words
  detectEcho(userMessage, proposedResponse) {
    const userLower = userMessage.toLowerCase().trim();
    const responseLower = proposedResponse.toLowerCase().trim();

    // Exact match = echo
    if (userLower === responseLower) return true;

    // Very similar = likely echo
    const similarity = this.calculateSimilarity(userLower, responseLower);
    return similarity > 0.8;
  }

  // Calculate text similarity (0-1)
  calculateSimilarity(str1, str2) {
    const words1 = new Set(str1.split(/\s+/));
    const words2 = new Set(str2.split(/\s+/));

    const intersection = new Set([...words1].filter((x) => words2.has(x)));
    const union = new Set([...words1, ...words2]);

    return intersection.size / union.size;
  }

  // Get contextually appropriate response for short user messages
  getSmartShortResponse(userMessage, conversationContext = {}) {
    const msg = userMessage.toLowerCase().trim();

    // Map common short messages to smart responses
    const responseMap = {
      oh: ["knp?", "iya", "trus?", "emang"],
      hmm: ["apaan", "knp hmm", "gmn?", "iya?"],
      oya: ["iya", "emang", "knp?", "terus?"],
      iya: ["trus?", "terus gimana?", "oke", "emang"],
      ya: ["trus?", "knp emg?", "oke", "emang"],
      hah: ["apaan", "knp?", "gmn?", "iya"],
      sip: ["oke", "yaudah", "emang", "trus?"],
      ok: ["oke", "yaudah", "trus?", "terus?"],
      wah: ["knp?", "kenapa?", "gmn?", "emang"],
      loh: ["knp?", "apaan", "gmn?", "iya"],
    };

    const options = responseMap[msg];
    if (!options) return null;

    // Pick random to avoid patterns
    return options[Math.floor(Math.random() * options.length)];
  }

  // Detect conversation momentum
  analyzeConversationFlow(history) {
    if (history.length < 4) return "normal";

    const recent = history.slice(-4);
    let shortMsgCount = 0;
    let totalWords = 0;

    for (const msg of recent) {
      const words = msg.content.split(/\s+/).length;
      totalWords += words;
      if (words <= 2) shortMsgCount++;
    }

    const avgWords = totalWords / recent.length;

    if (shortMsgCount >= 3) return "dying";
    if (avgWords < 3) return "low_energy";
    if (avgWords > 10) return "engaged";
    return "normal";
  }

  // Generate conversation revival prompts
  getRevivalPrompt(flow) {
    const prompts = {
      dying: [
        "btw lu lagi ngapain?",
        "eh btw gua mau nanya",
        "males ah chat pendek mulu",
        "ngomong dong yang bener",
      ],
      low_energy: [
        "trus?",
        "terus gimana?",
        "btw lu tau ga",
        "oh iya gua mau ngomong",
      ],
    };

    const options = prompts[flow];
    if (!options) return null;

    return options[Math.floor(Math.random() * options.length)];
  }

  // Check if response shows self-awareness
  hasS;

  elfAwareness(response) {
    const selfAwarePatterns = [
      /gua (tau|ngerti|paham)/i,
      /gua (ga|gak|ngga) (tau|ngerti)/i,
      /menurut gua/i,
      /gua rasa/i,
      /gua pikir/i,
      /gua yakin/i,
    ];

    return selfAwarePatterns.some((pattern) => pattern.test(response));
  }

  // Validate response quality
  validateResponse(response, userMessage, history) {
    const issues = [];

    // Check for echo
    if (response.toLowerCase().trim() === userMessage.toLowerCase().trim()) {
      issues.push({
        type: "echo",
        severity: "critical",
        message: "Response echoes user's exact words",
      });
    }

    // Check for too short when user asked question
    if (userMessage.includes("?") && response.split(/\s+/).length < 3) {
      issues.push({
        type: "short_answer",
        severity: "medium",
        message: "Response too short for user's question",
      });
    }

    // Check for repetition with recent AI messages
    const recentAI = history.filter((m) => m.role === "assistant").slice(-3);
    for (const msg of recentAI) {
      if (msg.content === response) {
        issues.push({
          type: "repetition",
          severity: "high",
          message: "Response repeats recent AI message",
        });
      }
    }

    return {
      isValid:
        issues.length === 0 || issues.every((i) => i.severity !== "critical"),
      issues,
    };
  }
}

module.exports = HumanResponseIntelligence;
