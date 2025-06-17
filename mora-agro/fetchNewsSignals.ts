import axios from 'axios';
import { Signal } from '../types/Signal';
import dotenv from 'dotenv';
dotenv.config();

const SERP_API_KEY = process.env.SERP_API_KEY as string;
const SERP_API_URL = 'https://serpapi.com/search.json';

const STEM_REGIONS = ['Singapore', 'Japan', 'South Korea', 'Taiwan', 'Finland', 'Norway', 'Sweden'];
const WATER_REGIONS = ['Kenya', 'Bangladesh', 'Pakistan', 'Nigeria', 'Sudan'];
const POWER_REGIONS = ['Brazil', 'India', 'South Africa', 'Philippines'];

export async function fetchNewsSignals(region: string): Promise<Signal[]> {
  const signals: Signal[] = [];
  const queries = buildQueriesForRegion(region);

  for (const query of queries) {
    try {
      const url = `${SERP_API_URL}?engine=google_news&q=${encodeURIComponent(query)}&gl=us&api_key=${SERP_API_KEY}`;
      const res = await axios.get(url);
      const articles = res.data?.news_results || [];

      for (const article of articles.slice(0, 2)) {
        const title = article.title || '';
        const link = article.link || '';
        const source = article.source || '';
        const summary = article.snippet || '';

        if (!title || !link) continue;

        signals.push({
          region,
          type: 'news',
          source: source,
          content: title,
          indicators: [query],
          tags: assignTagsFromQuery(query),
          problem: mapProblemFromQuery(query),
          message: summary,
          url: link,
        });
      }
    } catch (err: any) {
      console.warn(`❌ News fetch failed for query "${query}" in ${region}: ${err.message}`);
    }
  }

  return signals;
}

function buildQueriesForRegion(region: string): string[] {
  const queries: string[] = [];

  if (STEM_REGIONS.includes(region)) {
    queries.push('STEM lab funding', 'mobile STEM classroom', 'school lacks science tools');
  }

  if (WATER_REGIONS.includes(region)) {
    queries.push('clean water shortage', 'filtration system needed', 'well contamination');
  }

  if (POWER_REGIONS.includes(region)) {
    queries.push('frequent power outages', 'solar grid instability', 'electricity failure in rural areas');
  }

  // Emergency trigger – high relevance everywhere
  queries.push('natural disaster', 'flood damage', 'heatwave power failure', 'storm recovery needs');

  return queries;
}

function assignTagsFromQuery(query: string): string[] {
  const lower = query.toLowerCase();

  if (lower.includes('water') || lower.includes('well') || lower.includes('filtration')) return ['water'];
  if (lower.includes('stem') || lower.includes('school') || lower.includes('lab')) return ['stem'];
  if (lower.includes('power') || lower.includes('solar') || lower.includes('electricity')) return ['solar'];
  if (lower.includes('disaster') || lower.includes('flood') || lower.includes('heatwave') || lower.includes('storm')) return ['disaster'];

  return [];
}

function mapProblemFromQuery(query: string): string {
  const q = query.toLowerCase();

  const map: Record<string, string> = {
    'clean water shortage': 'watercrisis',
    'filtration system needed': 'waterfiltration',
    'well contamination': 'watercrisis',
    'frequent power outages': 'gridfailure',
    'solar grid instability': 'solarissue',
    'electricity failure in rural areas': 'gridfailure',
    'stem lab funding': 'stemshortage',
    'mobile stem classroom': 'stemshortage',
    'school lacks science tools': 'stemshortage',
    'natural disaster': 'disasterrelief',
    'flood damage': 'flooddamage',
    'heatwave power failure': 'heatgridfailure',
    'storm recovery needs': 'stormrecovery',
  };

  return map[q] || q.replace(/\s+/g, '_');
}
