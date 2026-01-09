// ========================================
// Voice System - Natural TTS Module
// ElevenLabs Integration for Natural Voice
// ========================================

// Voice configuration
let voiceSystem = {
  useElevenLabs: false, // Will be true if API key is set
  elevenLabsApiKey: null,
  selectedVoiceId: "EXAVITQu4vr4xnSDxMaL", // Sarah - Female, young, natural
  fallbackToWebSpeech: true,
};

// Initialize ElevenLabs if API key exists
function initElevenLabs() {
  // Check for ElevenLabs API key in .env
  const elevenLabsKey = process.env.ELEVENLABS_API_KEY;

  if (elevenLabsKey) {
    voiceSystem.elevenLabsApiKey = elevenLabsKey;
    voiceSystem.useElevenLabs = true;
    console.log("✅ ElevenLabs TTS enabled (Natural Voice)");
  } else {
    console.log("ℹ️ ElevenLabs API key not found - using Web Speech API");
    console.log("💡 Add ELEVENLABS_API_KEY to .env for natural voice!");
  }
}

// Speak using ElevenLabs (Natural AI Voice)
async function speakElevenLabs(text) {
  if (!voiceSystem.elevenLabsApiKey) {
    console.warn("ElevenLabs API key missing");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceSystem.selectedVoiceId}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": voiceSystem.elevenLabsApiKey,
        },
        body: JSON.stringify({
          text: text,
          model_id: "eleven_multilingual_v2", // Supports Indonesian!
          voice_settings: {
            stability: 0.5, // More expressive
            similarity_boost: 0.75,
            style: 0.5, // Balanced
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // Get audio blob
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);

    // Play audio
    const audio = new Audio(audioUrl);

    // Add speaking animation
    if (voiceToggleBtn) {
      voiceToggleBtn.classList.add("speaking");
      audio.onended = () => {
        voiceToggleBtn.classList.remove("speaking");
        URL.revokeObjectURL(audioUrl);
      };
    }

    await audio.play();
    return true;
  } catch (error) {
    console.error("ElevenLabs TTS error:", error);
    return false;
  }
}

// Main speak function with intelligent fallback
async function speakNatural(text) {
  if (!voiceEnabled) return;

  // Try ElevenLabs first (if enabled)
  if (voiceSystem.useElevenLabs) {
    const success = await speakElevenLabs(text);
    if (success) return;

    console.warn("ElevenLabs failed, falling back to Web Speech API");
  }

  // Fallback to Web Speech API
  speakWebSpeech(text);
}

// Web Speech API (fallback)
function speakWebSpeech(text) {
  if (!voiceEnabled) return;

  // Cancel any ongoing speech
  synth.cancel();

  // Create utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // Set voice and settings
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  utterance.pitch = voiceSettings.pitch;
  utterance.rate = voiceSettings.rate;
  utterance.volume = voiceSettings.volume;

  // Add speaking animation
  if (voiceToggleBtn) {
    voiceToggleBtn.classList.add("speaking");
    utterance.onend = () => {
      voiceToggleBtn.classList.remove("speaking");
    };
  }

  // Speak!
  synth.speak(utterance);
}

// Export for use in main app
if (typeof module !== "undefined" && module.exports) {
  module.exports = { speakNatural, initElevenLabs, voiceSystem };
}
