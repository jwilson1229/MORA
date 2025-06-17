// mora-agro/gatherAllSignals.ts
import { Signal } from '../types/Signal';
import { fetchWeatherSignals } from './fetchWeatherSignals';
import { fetchRedditSignals } from './fetchRedditSignals';
import { fetchNewsSignals } from './fetchNewsSignals';

let cachedRedditSignals: Signal[] = [];

export async function gatherAllSignals(region: string): Promise<Signal[]> {
  const weatherPromise = fetchWeatherSignals(region);
  const newsPromise = fetchNewsSignals(region);

  if (!cachedRedditSignals.length) {
    console.log('🌐 Running Reddit signal scan once...');
    try {
      cachedRedditSignals = await fetchRedditSignals(region); // no region passed now
    } catch (err) {
      console.error('❌ Reddit scan failed globally:', err);
      cachedRedditSignals = [];
    }
  }

  const [weatherSignals, newsSignals] = await Promise.allSettled([weatherPromise, newsPromise]).then(results => {
    return results.map(result => (result.status === 'fulfilled' ? result.value : []));
  });

  console.log(`📥 Reddit signals: ${cachedRedditSignals.length}`);
  console.log(`🌦️ Weather signals: ${weatherSignals.length}`);
  console.log(`📰 News signals: ${newsSignals.length}`);

  return [...cachedRedditSignals, ...weatherSignals, ...newsSignals];
}
