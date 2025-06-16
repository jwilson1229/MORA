// fetchRedditSignals.ts
import axios from 'axios';
import { Signal } from '../types/Signal';
import dotenv from 'dotenv';
dotenv.config();

const REDDIT_API_URL = 'https://www.reddit.com/search.json';

const KEYWORDS = [
  'drought',
  'crop failure',
  'pest outbreak',
  'solar inverter fail',
  'STEM education',
  'school closed',
  'water scarcity',
  'smart irrigation not working',
  'aquaponics failure',
  'sensor not working'
];

const bannedWords = ['nsfw', 'porn', 'meme', 'shitpost', 'joke', 'onlyfans', 'crypto', 'dating'];

const requiredContextWords = [
  'farm', 'crop', 'school', 'sensor', 'water', 'solar', 'lab', 'teacher', 'village', 'irrigation',
  'climate', 'education', 'power', 'monitor', 'outage', 'student', 'greenhouse', 'weather'
];

function assignTagsFromKeyword(keyword: string): string[] {
  const lower = keyword.toLowerCase();

  if (
    lower.includes('soil') || lower.includes('crop') || lower.includes('farm') ||
    lower.includes('irrigation') || lower.includes('drought') || lower.includes('pest')
  ) return ['ag'];

  if (
    lower.includes('solar') || lower.includes('power') || lower.includes('electricity') ||
    lower.includes('inverter')
  ) return ['solar'];

  if (
    lower.includes('school') || lower.includes('lab') || lower.includes('stem') ||
    lower.includes('education') || lower.includes('sensor') || lower.includes('monitor')
  ) return ['stem'];

  if (
    lower.includes('water') || lower.includes('flood') || lower.includes('well')
  ) return ['water'];

  return [];
}

export async function fetchRedditSignals(region: string): Promise<Signal[]> {
  const signals: Signal[] = [];
  const MAX_SIGNALS = 10;

  for (const keyword of KEYWORDS) {
    if (signals.length >= MAX_SIGNALS) break;

    try {
      const res = await axios.get(REDDIT_API_URL, {
        params: {
          q: `"${keyword}"`,
          limit: 1,
          sort: 'new',
          restrict_sr: false,
        },
        headers: {
          'User-Agent': 'MORA-Bot/1.0 (+https://moraglobal.com)',
        },
      });

      const posts = res.data?.data?.children || [];

      for (const post of posts) {
        const data = post.data;
        const title = data.title?.toLowerCase() || '';
        const body = data.selftext?.toLowerCase() || '';
        const fullText = `${title} ${body}`;

        const isBanned = bannedWords.some(word => fullText.includes(word));
        const hasContext = requiredContextWords.some(word => fullText.includes(word));

        if (isBanned || !hasContext) continue;

        const permalink = data.permalink ? `https://reddit.com${data.permalink}` : 'https://reddit.com';

        signals.push({
          content: keyword.toLowerCase(),
          region,
          source: permalink,
          type: 'reddit',
          indicators: [keyword.toLowerCase()],
          problem: keyword.toLowerCase().replace(/\s+/g, ''),
          tags: assignTagsFromKeyword(keyword),
          url: permalink, // ✅ confirmed for MORA Talk summaries
        });

        console.log(`🎯 Reddit hit: "${keyword}" → ${permalink}`);
      }
    } catch (err) {
      console.warn(`❌ Failed to fetch Reddit signals for "${keyword}"`);
    }
  }

  console.log(`📥 Total Reddit signals: ${signals.length}`);
  return signals;
}
