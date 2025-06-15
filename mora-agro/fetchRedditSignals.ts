import axios from 'axios';
import dotenv from 'dotenv';
import { Signal } from '../types/Signal';
import { regionGroups } from './regionGroups';

dotenv.config();

const keywords = [
  // 🌾 Core Agriculture & Climate Stress
  'drought', 'irrigation', 'soil dryness', 'crop failure', 'crop disease', 'plant virus',
  'heat wave', 'flooding', 'pest outbreak', 'climate stress', 'weather extremes',
  'water scarcity', 'desertification', 'soil erosion', 'unseasonal rains',

  // 🌱 Smart Agriculture & Innovation
  'agriculture technology', 'precision farming', 'smart farm', 'green tech',
  'IoT farming', 'climate-smart agriculture', 'AI in farming', 'sensor farming',
  'machine learning agriculture', 'data-driven farming', 'LoRa farm', 'remote sensing agriculture',

  // 🌿 Controlled Environments & Alternatives
  'greenhouse', 'hydroponics', 'aquaponics', 'vertical farming', 'container farming',

  // 💥 Supply Chain Disruptions & Protests
  'food shortage', 'seed shortage', 'fertilizer shortage', 'price hike',
  'market crash', 'export ban', 'government ban', 'farmer protest', 'input cost crisis',

  // 🚜 Equipment & Infrastructure
  'tractors', 'drip irrigation', 'solar irrigation', 'farm automation',
  'rural technology', 'agro-infrastructure', 'cold storage farming',

  // ☀️ Solar Tech / Off-Grid Power / Energy Crisis
  'solar panel', 'solar energy', 'off-grid power', 'solar kit', 'solar irrigation',
  'solar outage', 'power outage', 'energy blackout', 'rural electrification',
  'solar charge controller', 'solar battery storage', 'solar inverter',
  'solar-powered light', 'solar pump', 'solar farm', 'clean energy for farming',
  'solar school', 'renewable energy africa', 'solar subsidies', 'solar tech innovation', 'power crisis',
];


const requiredContextWords = [
  // 🌾 Agriculture Core Context
  'crop', 'soil', 'rain', 'weather', 'farming', 'yield', 'agriculture', 'harvest',
  'field', 'plant', 'pests', 'livestock', 'irrigation', 'climate', 'disease',

  // 🌱 Tech & Monitoring
  'sensor', 'temperature', 'humidity', 'data', 'monitoring', 'automation',
  'environment', 'precision', 'greenhouse', 'hydroponics', 'aquaponics',

  // ⚡ Solar / Off-Grid Energy Context
  'solar', 'power', 'battery', 'energy', 'outage', 'blackout', 'inverter', 'charge controller',
  'panel', 'off-grid', 'lighting', 'electricity', 'infrastructure', 'renewable', 'storage',

  // 🌍 Rural & Market Impact
  'rural', 'remote', 'access', 'infrastructure', 'connectivity', 'distribution', 'resilience'
];


const bannedPhrases = [
  // 🚫 NSFW & Relationship Content
  'bedroom', 'romance', 'love', 'relationship', 'hookup', 'flirting', 'kiss', 'date', 'crush',
  'nudes', 'sexual', 'fantasy', 'intimacy', 'onlyfans', 'cheating', 'affair',

  // 🤡 Jokes, Skits, Irrelevant Humor
  'joke', 'funny', 'meme', 'storytime', 'standup', 'prank', 'skit', 'satire', 'parody',

  // 🏋️‍♂️ Irrelevant Fitness / Lifestyle
  'gymnastics', 'gym', 'workout', 'bodybuilding', 'weight loss', 'abs', 'fitness influencer',

  // 🎮 Unrelated Hobbies or Entertainment
  'anime', 'minecraft', 'fortnite', 'celebrity', 'fashion', 'hairstyle', 'makeup tutorial',
  'kpop', 'marvel', 'binge', 'movie night', 'streamer', 'cosplay', 'fanfiction',

  // 🧵 Low-Quality or Story-Based Threads
  'aita', 'tifu', 'confession', 'rant', 'vent', 'personal story', 'today i learned',

  // 💰 Get-Rich/Scam Content
  'crypto', 'forex', 'dropshipping', 'mlm', 'get rich quick', 'hustle culture',

  // 🔥 Internet Buzzwords Likely to Distract
  'viral', 'trending', 'challenge', 'clout', 'vibe', 'aesthetic'
];


const subredditMap: Record<string, string[]> = {
  'South Asia': ['r/india', 'r/pakistan', 'r/farming'],
  'Latin America': ['r/argentina', 'r/brazil', 'r/peru', 'r/mexico', 'r/colombia'],
  'Middle East': ['r/iraq', 'r/saudiarabia', 'r/uae', 'r/egypt', 'r/jordan'],
  'East Africa': ['r/kenya', 'r/uganda', 'r/tanzania', 'r/rwanda'],
  'Southeast Asia': ['r/philippines', 'r/vietnam', 'r/thailand', 'r/indonesia', 'r/malaysia'],
  'West Africa': ['r/nigeria', 'r/ghana', 'r/farming'],
};

let redditTokenCache: string | null = null;

export async function fetchRedditSignals(region: string): Promise<Signal[]> {
  const regionGroup = Object.entries(regionGroups).find(([, countries]) => countries.includes(region))?.[0];
  if (!regionGroup) {
    console.warn(`⚠️ No region group found for ${region}`);
    return [];
  }

  const subreddits = (subredditMap[regionGroup] || []).slice(0, 3);
  if (subreddits.length === 0) return [];

  if (!redditTokenCache) redditTokenCache = await getRedditAccessToken();
  if (!redditTokenCache) return [];

  const matches: Signal[] = [];

  const fetches = subreddits.map(async (subreddit) => {
    try {
      const res = await axios.get(`https://oauth.reddit.com/${subreddit}/new.json?limit=25`, {
        headers: {
          Authorization: `Bearer ${redditTokenCache}`,
          'User-Agent': 'mora-agro-bot/1.0 by jacobwilson'
        }
      });

      const posts: any[] = res.data?.data?.children || [];
      posts.forEach((post) => {
        const title = post.data?.title?.toLowerCase?.() || '';
        const body = post.data?.selftext?.toLowerCase?.() || '';
        const content = `${title} ${body}`;
        const matchKeyword = keywords.find(k => content.includes(k));

        if (matchKeyword && isRelevantRedditPost(content)) {
          matches.push({
            region,
            type: 'reddit',
            source: subreddit,
            indicators: [matchKeyword],
            message: undefined,
            content: title,
            problem: body,
            tags: [matchKeyword],
            url: `https://www.reddit.com${post.data?.permalink}`,
          });
        }
      });
    } catch (err: any) {
      console.error(`❌ Reddit fetch error [${subreddit}]:`, err.message);
    }
  });

  await Promise.all(fetches);
  return matches;
}

function isRelevantRedditPost(content: string): boolean {
  if (content.length > 600 || content.length < 20) return false;
  if (bannedPhrases.some(b => content.includes(b))) return false;
  const contextHits = requiredContextWords.filter(w => content.includes(w));
  return contextHits.length > 0;
}

async function getRedditAccessToken(): Promise<string | null> {
  try {
    const credentials = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_SECRET}`).toString('base64');
    const res = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'mora-agro-bot/1.0 by jacobwilson'
        }
      }
    );
    return res.data?.access_token || null;
  } catch (err: any) {
    console.error('❌ Failed to obtain Reddit token:', err.message);
    return null;
  }
}
