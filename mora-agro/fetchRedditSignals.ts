// fetchRedditSignals.ts
import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
import { Signal } from '../types/Signal';
dotenv.config();

const KEYWORDS = [
  'irrigation broken', 'drought in my area', 'crop failure', 'pests destroyed crops', 'no rain for weeks',
  'soil sensor failure', 'greenhouse overheating', 'solar panel not working', 'solar inverter failed',
  'solar battery not charging', 'power outage rural', 'grid blackout again', 'frequent blackouts at night',
  'no clean water', 'well dried up', 'contaminated water supply', 'water pump failure',
  'school STEM lab broken', 'school needs lab equipment', 'no internet in school', 'students can’t access resources',
  'education tools not available', 'sensor stopped working', 'weather station down', 'monitoring system failed',
  'data logger not responding'
];

const bannedWords = [
  // Adult / NSFW
  'nsfw', 'porn', 'onlyfans', 'nudes', 'leak', 'stripper', 'fetish', 'sex', 'erotic',

  // Jokes / Memes / Humor
  'shitpost', 'joke', 'troll', 'meme', 'sarcasm', 'lol', 'lmao', 'haha', 'satire', 'parody',

  // Fantasy / Fiction / Gaming
  'dnd', 'fantasy', 'sci-fi', 'magic', 'dragon', 'sorcery', 'wizard', 'orc', 'alien', 'vampire', 'zombie', 'ghost', 'curse',

  // Gambling / Crypto / Hype
  'gambling', 'betting', 'casino', 'sportsbook', 'crypto', 'nft', 'bitcoin', 'dogecoin',

  // Pop culture / Celebrity / Gossip
  'elon', 'celebrity', 'celeb', 'kardashian', 'beef', 'drama', 'paparazzi',

  // Relationship chatter
  'dating', 'hookup', 'crush', 'breakup', 'divorce', 'girlfriend', 'boyfriend', 'ex',

  // Misc noise
  'astrology', 'horoscope', 'zodiac', 'psychic', 'dream', 'manifest', 'spells', 'ritual'
];


const contextWords = [
  'farm', 'village', 'rural', 'agriculture', 'student', 'teacher', 'lab', 'sensor',
  'school', 'clinic', 'water', 'monitor', 'greenhouse', 'outage', 'irrigation',
  'solar', 'power', 'grid', 'battery', 'well', 'filter', 'education', 'stem',
  'diagnostic', 'weather', 'crop', 'flood', 'heatwave', 'storm', 'tools', 'learning'
];

function mapProblem(raw: string): string {
  const mappings: Record<string, string> = {
    'drought in my area': 'drought',
    'no rain for weeks': 'drought',
    'crop failure': 'cropfailure',
    'pests destroyed crops': 'pestdamage',
    'irrigation broken': 'irrigationfailure',
    'solar panel not working': 'solarissue',
    'solar inverter failed': 'solarissue',
    'solar battery not charging': 'solarissue',
    'power outage rural': 'gridfailure',
    'grid blackout again': 'gridfailure',
    'frequent blackouts at night': 'gridfailure',
    'well dried up': 'waterloss',
    'no clean water': 'watercrisis',
    'contaminated water supply': 'watercrisis',
    'water pump failure': 'waterpumpfailure',
    'school needs lab equipment': 'stemshortage',
    'school STEM lab broken': 'stemshortage',
    'sensor stopped working': 'diagnosticfailure',
    'monitoring system failed': 'diagnosticfailure',
    'weather station down': 'diagnosticfailure',
    'data logger not responding': 'diagnosticfailure',
  };
  return mappings[raw] || raw.replace(/\s+/g, '');
}

function assignTagsFromKeyword(keyword: string): string[] {
  const k = keyword.toLowerCase();
  if (k.includes('school') || k.includes('stem') || k.includes('lab')) return ['stem'];
  if (k.includes('water') || k.includes('well')) return ['water'];
  if (k.includes('irrigation') || k.includes('crop') || k.includes('drought') || k.includes('farm')) return ['ag'];
  if (k.includes('solar') || k.includes('power')) return ['solar'];
  if (k.includes('sensor') || k.includes('monitor') || k.includes('diagnostic')) return ['diagnostics'];
  return [];
}

let tokenCache: string | null = null;
let tokenExpiresAt = 0;

async function getRedditToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenExpiresAt - 60000) return tokenCache;

  const creds = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString('base64');
  const res = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    qs.stringify({ grant_type: 'client_credentials' }),
    { headers: { Authorization: `Basic ${creds}`, 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  tokenCache = res.data.access_token;
  tokenExpiresAt = Date.now() + res.data.expires_in * 1000;
  if (!tokenCache) {
    throw new Error('Failed to obtain Reddit access token');
  }
  return tokenCache;
}

export async function fetchRedditSignals(region: string): Promise<Signal[]> {
  const signals: Signal[] = [];
  const MAX_SIGNALS = 12;
  const token = await getRedditToken();

  for (const keyword of KEYWORDS) {
    if (signals.length >= MAX_SIGNALS) break;

    try {
      const res = await axios.get('https://oauth.reddit.com/search', {
        params: { q: `"${keyword}"`, sort: 'new', limit: 2 },
        headers: { Authorization: `Bearer ${token}`, 'User-Agent': 'MORA-Bot/1.0' }
      });

      const posts = res.data?.data?.children || [];

      for (const post of posts) {
        const data = post.data;
        const title = data.title?.toLowerCase() || '';
        const body = data.selftext?.toLowerCase() || '';
        const fullText = `${title} ${body}`;

        const isBanned = bannedWords.some(word => fullText.includes(word));
        const hasContext = contextWords.some(word => fullText.includes(word));
        if (isBanned || !hasContext) continue;

        const permalink = data.permalink ? `https://reddit.com${data.permalink}` : 'https://reddit.com';
        const subreddit = data.subreddit || 'unknown';
        const quote = title.length > 20 ? `"${title.slice(0, 150)}"` : `"Post about ${keyword}"`;

        signals.push({
          content: quote,
          region,
          source: `r/${subreddit}`,
          type: 'reddit',
          indicators: [keyword.toLowerCase()],
          problem: mapProblem(keyword.toLowerCase()),
          tags: assignTagsFromKeyword(keyword),
          url: permalink,
        });

        if (signals.length >= MAX_SIGNALS) break;
        console.log(`🧠 Reddit signal: ${keyword} → r/${subreddit} ${permalink}`);
      }

      await new Promise(res => setTimeout(res, 1200)); // 1.2s throttle
    } catch (err) {
      console.warn(`❌ Reddit error [${keyword}]:`, (err as any).message);
    }
  }

  console.log(`📥 Final Reddit signal count: ${signals.length}`);
  return signals;
}
