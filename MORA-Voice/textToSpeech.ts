import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY!;
const VOICE_ID = process.env.MORA_VOICE_ID!;

function cleanSSML(text: string): string {
  return text
    .replace(/\$(\d+\.\d{2})/g, (_, amt) => `<say-as interpret-as="cardinal">${amt}</say-as>`)
    .replace(/\[PAUSE\]/g, '<break time="700ms"/>')
    .replace(/&/g, 'and'); // fallback: safety from bad SSML input
}

export async function textToSpeech(text: string): Promise<Buffer> {
  if (!ELEVENLABS_API_KEY || !VOICE_ID) {
    throw new Error('Missing ELEVENLABS_API_KEY or MORA_VOICE_ID in .env');
  }

  const ssml = `<speak>${cleanSSML(text)}</speak>`;

  try {
    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
      {
        text: ssml,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8
        },
        stream: false,
        output_format: "mp3_44100_128",
        optimize_streaming_latency: 1,
      },
      {
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        responseType: 'arraybuffer',
      }
    );

    return Buffer.from(response.data);
  } catch (error: any) {
    const message = error?.response?.data || error.message;
    throw new Error(`❌ ElevenLabs TTS failed: ${JSON.stringify(message)}`);
  }
}
