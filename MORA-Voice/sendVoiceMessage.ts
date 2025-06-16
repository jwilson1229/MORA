// MORA-Voice/sendVoiceMessage.ts
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID!;

/**
 * Sends a voice message (OGG format) to the Telegram bot chat.
 */
export async function sendVoiceMessage(filePath: string): Promise<void> {
  try {
    const absolutePath = path.resolve(filePath);
    const voiceStream = fs.createReadStream(absolutePath);

    const form = new FormData();
    form.append('chat_id', TELEGRAM_CHAT_ID);
    form.append('voice', voiceStream);

    const response = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendVoice`,
      form,
      {
        headers: form.getHeaders(),
      }
    );

    if (response.status === 200) {
      console.log('📢 Voice message sent successfully.');
    } else {
      console.error('⚠️ Telegram responded with non-200:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ Failed to send voice message:', error);
    throw error;
  }
}
