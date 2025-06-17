import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const ELEVEN_API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.MORA_VOICE_ID!;

const testLine = `Hey Jacob… I spotted a 63% surge in organic fertilizer searches — in Malawi. Before your coffee even brewed. Just sayin’. I'll get back to work and you get back to doing what you do best, absolutely nothing`;

async function generateTestSpeech(text: string) {
  try {
    const resp = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      headers: {
        'xi-api-key': ELEVEN_API_KEY,
        'Content-Type': 'application/json'
      },
      data: {
  text,
  model_id: 'eleven_monolingual_v1',
  voice_settings: {
    stability: 0.7,
    similarity_boost: 0.85,
    style: 1.0,
    speed: 0.87
  }
}
,
      responseType: 'arraybuffer'
    });
    fs.writeFileSync('mora-test.mp3', resp.data);
    console.log('✅ Mora voice test saved as mora-test.mp3');
  } catch (err: any) {
    console.error('❌ Failed to generate speech:', err.response?.data?.toString() || err.message);
  }
}

generateTestSpeech(testLine);
