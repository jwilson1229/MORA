import { Signal } from '../types/Signal';
import { fetchWeatherSignals } from './fetchWeatherSignals';
import { fetchRedditSignals } from './fetchRedditSignals';

export async function gatherAllSignals(region: string): Promise<Signal[]> {
  const [redditSignals, weatherSignals] = await Promise.all([
    fetchRedditSignals(region),
    fetchWeatherSignals()
  ]);

  console.log(`📥 Reddit signals: ${redditSignals.length}`);
  console.log(`🌦️ Weather signals: ${weatherSignals.length}`);

  return [...redditSignals, ...weatherSignals];
}
