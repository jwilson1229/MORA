// fetchEventRegistryNews.ts
import axios from 'axios';
import { Signal } from '../types/Signal';
import dotenv from 'dotenv';
dotenv.config();

const EVENT_REGISTRY_API = 'https://eventregistry.org/api/v1/article/getArticles';
const API_KEY = process.env.EVENT_REGISTRY_API_KEY;

// 🔍 High-signal event triggers across MORA's verticals
const STRATEGIC_KEYWORDS = [
  // Climate/Ag
  'drought',
  'extreme heat',
  'crop failure',
  'locust swarm',
  'irrigation collapse',
  'soil degradation',

  // Solar / Energy
  'power outage',
  'blackout',
  'off-grid power',
  'fuel shortage',
  'energy rationing',

  // DX / Medical
  'cholera outbreak',
  'malaria surge',
  'diagnostic crisis',
  'medical monitoring failure',
  'mobile clinic',
  'pandemic alert',

  // Water
  'water scarcity',
  'flood',
  'toxic water',
  'contaminated wells',
  'infrastructure collapse',

  // STEM / Education
  'stem education initiative',
  'school rebuild',
  'science classroom',
  'lab equipment shortage',

  // Conflict / Social
  'warzone',
  'refugee crisis',
  'displaced population',
  'infrastructure damage',
  'evacuation warning',
  'regional instability',
];

export async function fetchEventRegistrySignals(region: string): Promise<Signal[]> {
  if (!API_KEY) throw new Error('Missing EVENT_REGISTRY_API_KEY in environment');

  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const signals: Signal[] = [];

  for (const keyword of STRATEGIC_KEYWORDS) {
    try {
      const res = await axios.post(EVENT_REGISTRY_API, {
        apiKey: API_KEY,
        keyword,
        lang: 'eng',
        locationUri: `http://en.wikipedia.org/wiki/${region}`,
        dateStart: thirtyDaysAgo.toISOString().split('T')[0],
        dateEnd: today.toISOString().split('T')[0],
        isDuplicateFilter: true,
        includeArticleConcepts: true,
        includeArticleCategories: true,
        includeArticleLocation: true,
        includeArticleImage: false,
        includeArticleEventUri: false,
        articlesPage: 1,
        articlesCount: 1 // Limit to 1 article per keyword to save credits
      });

      const articles = res.data?.articles?.results || [];

      for (const article of articles) {
        const trimmedKeyword = keyword.toLowerCase().trim();
        signals.push({
          content: trimmedKeyword,
          region,
          source: article.url || 'EventRegistry',
          type: 'news',
          indicators: [trimmedKeyword],
          problem: trimmedKeyword.replace(/[^a-zA-Z]/g, ''),
          tags: [trimmedKeyword.split(' ')[0]],
          url: article.url || ''
        });
      }
    } catch (err) {
      console.warn(`❌ Failed to fetch EventRegistry data for "${keyword}" in ${region}`);
    }
  }

  console.log(`📰 News signals (${region}): ${signals.length}`);
  return signals;
}
