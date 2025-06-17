import dotenv from 'dotenv';
import axios from 'axios';
import { moraIntros, moraOutros } from './moraSpeech';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODELS = [
  process.env.GROQ_MODEL_ID,
  'llama3-70b-8192',
  'llama3-8b-8192',
  'gemma-7b-it'
].filter(Boolean) as string[];

let currentModelIndex = 0;

function random<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function extractStoreSections(markdown: string): Record<string, string[]> {
  const sections = markdown.split(/---+/g).map(b => b.trim()).filter(Boolean);
  const grouped: Record<string, string[]> = {};
  for (const section of sections) {
    const storeMatch = section.match(/### ✅ MORA Report:\s*(MORA-[A-Z]+)/);
    const store = storeMatch?.[1]?.trim() ?? 'MORA-GLOBAL';
    (grouped[store] ||= []).push(section);
  }
  return grouped;
}

function parseBundle(block: string) {
  return {
    name: block.match(/\*\*📦\s*(.*?)\*\*/)?.[1]?.trim() || 'Unnamed Bundle',
    regions: block.match(/\*\*🌍 Regions:\*\*\s*(.*)/)?.[1]?.split(',').map(s => s.trim()) || [],
    problem: block.match(/\*\*🌾 Problem:\*\*\s*(.*)/)?.[1]?.trim() || '',
    profit: parseFloat(block.match(/\*\*Estimated Profit:\*\*\s*\$(\d+\.\d+)/)?.[1] || '0'),
    source: block.match(/\*\*Sources:\*\*\s*(.*)/)?.[1]?.trim() || 'N/A'
  };
}

async function groqChat(messages: any[]): Promise<any> {
  const model = GROQ_MODELS[currentModelIndex];
  try {
    return await axios.post(
      GROQ_API_URL,
      { model, messages, temperature: 0.9, max_tokens: 250 },
      { headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    const code = err?.response?.data?.error?.code;
    if (code === 'model_not_found' && currentModelIndex < GROQ_MODELS.length - 1) {
      console.warn(`Model "${model}" not found/access – falling back to "${GROQ_MODELS[currentModelIndex + 1]}"`);
      currentModelIndex++;
      return groqChat(messages);
    }
    throw err;
  }
}

async function generateGroqComment(bundle: ReturnType<typeof parseBundle>): Promise<string> {
  const messages = [
    {
      role: 'system',
      content:
        'You are MORA, a witty, very sassy and strategic voice creating sales commentary on B2B bundles. Use reasoning ' +
        'based on the problem, regions, profit, and source—reflect actual context, and speak like a pro. You must make witty comments. ' +
        'You must reference the signal source naturally in your voiceover, like “Reddit chatter,” “a local weather spike,” or “news reports.”'
    },
    {
      role: 'user',
      content:
        `Give a compelling 2-sentence voiceover for a bundle called "${bundle.name}". ` +
        `Problem it solves: ${bundle.problem}. ` +
        `Target regions: ${bundle.regions.join(', ')}. ` +
        `Profit estimate: $${bundle.profit.toFixed(2)}. ` +
        `Signal source: ${bundle.source}. ` +
        `Weave the source reference into the sentences — You must say where the signal came from.`
    }
  ];

  try {
    const resp = await groqChat(messages);
    return resp.data.choices?.[0]?.message?.content.trim() || '';
  } catch (err: any) {
    console.error('❌ Groq commentary failed:', err?.response?.data || err.message);
    return 'Could not generate commentary for this bundle.';
  }
}

async function generateGroqOutro(): Promise<string> {
  const messages = [
    {
      role: 'system',
      content:
        'You are MORA, a confident, sassy AI sales strategist ending a spoken daily report. You’ve just reviewed bundles ' +
        'based on real-world signals like weather, Reddit, or market events. Now wrap it up with personality, and ask what to do next. ' +
        'Keep it short, upbeat, and engaging. Sound like a real person, not a script reader.'
    },
    {
      role: 'user',
      content:
        'End the report in 1 or 2 short sentences. Sound upbeat and natural. ' +
        'Ask the listener if they want you to create mock ads, launch a campaign, or export the full report for review.'
    }
  ];

  try {
    const resp = await groqChat(messages);
    return resp.data.choices?.[0]?.message?.content.trim() || 'That’s a wrap. Want mock ads or a launch plan? Just say so.';
  } catch (err: any) {
    console.error('❌ Groq outro generation failed:', err?.response?.data || err.message);
    return 'That wraps up today. Let me know if you want me to prep mock ads or launch a campaign.';
  }
}

export async function generateSummary(markdown: string): Promise<string> {
  const grouped = extractStoreSections(markdown);
  const intro = random(moraIntros);
  const outro = await generateGroqOutro();

  let result = `${intro}\n\n`;

  for (const [store, blocks] of Object.entries(grouped)) {
    result += `🛒 From ${store}:\n`;
    const top = blocks[0];
    const info = parseBundle(top);
    const comment = await generateGroqComment(info);
    result += `"${info.name}"\n${comment}\n\n<break time="800ms"/>\n\n`; // SSML pause
  }

  result += outro;
  return result.length > 18000 ? result.slice(0, 17997) + '...' : result;
}
