// MORA-Voice/textToSpeech.ts
import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import fetch from 'node-fetch';

/**
 * Converts text to speech and saves it as an .ogg file for Telegram.
 */
export async function textToSpeech(text: string, filename = 'mora-voice.ogg'): Promise<string> {
  try {
    // Split into chunks because Google TTS has a 200 character limit
    const maxLength = 200;
    const chunks: string[] = [];

    for (let i = 0; i < text.length; i += maxLength) {
      const chunk = text.slice(i, i + maxLength);
      const url = googleTTS.getAudioUrl(chunk, {
        lang: 'en',
        slow: false,
        host: 'https://translate.google.com',
      });
      chunks.push(url);
    }

    // Fetch and combine all audio chunks
    const audioBuffers = await Promise.all(
      chunks.map(async (url) => {
        const res = await fetch(url);
        return res.arrayBuffer();
      })
    );

    const fullBuffer = Buffer.concat(audioBuffers.map((buf) => Buffer.from(buf)));

    const outputPath = `./${filename}`;
    fs.writeFileSync(outputPath, fullBuffer);
    return outputPath;
  } catch (error) {
    console.error('❌ Failed to generate speech audio:', error);
    throw error;
  }
}
