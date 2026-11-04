/**
 * VantorX Solutions — Official ElevenLabs Voice AI Engine Service
 * Powered by ElevenLabs SDK & Turbo v2.5
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });
if (!process.env.ELEVENLABS_API_KEY) {
  require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
}

const { ElevenLabsClient } = require('elevenlabs');

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.warn('[ElevenLabs Service Warning] ELEVENLABS_API_KEY not found in .env or .env.local');
}

const client = new ElevenLabsClient({ apiKey });

// Default Curated Voices for VantorX
const VOICES = {
  ADAM: 'pNInz6obpgDQGcFmaJgB',      // Dominant, Firm, High authority B2B
  CHARLIE: 'IKne3meq5aSn9XLyUdCD',   // Deep, Confident, Energetic Storyteller
  LIAM: 'TX3LPaxmHKxFdv7VOQHJ',      // Energetic, Viral Reels & Social Media
  SARAH: 'EXAVITQu4vr4xnSDxMaL',     // Reassuring, Confident, Professional Dispatch
  AVA: 'pNInz6obpgDQGcFmaJgB'        // Default Master Ava
};

/**
 * Generate speech and save to MP3
 */
async function generateSpeechToFile({
  text,
  voiceId = VOICES.ADAM,
  outputPath,
  modelId = 'eleven_turbo_v2_5',
  stability = 0.45,
  similarityBoost = 0.85
}) {
  if (!apiKey) throw new Error('ELEVENLABS_API_KEY is required');
  if (!text) throw new Error('Text parameter is required');

  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const audioStream = await client.textToSpeech.convert(voiceId, {
    text,
    model_id: modelId,
    voice_settings: {
      stability,
      similarity_boost: similarityBoost,
      style: 0.25,
      use_speaker_boost: true
    }
  });

  const writeStream = fs.createWriteStream(outputPath);
  
  return new Promise((resolve, reject) => {
    audioStream.pipe(writeStream);
    writeStream.on('finish', () => resolve(outputPath));
    writeStream.on('error', reject);
  });
}

/**
 * Get all available voices
 */
async function getVoices() {
  const resp = await client.voices.getAll();
  return resp.voices;
}

module.exports = {
  client,
  VOICES,
  generateSpeechToFile,
  getVoices
};
