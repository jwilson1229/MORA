import { Signal } from '../types/Signal';
import { fetchRedditSignals } from './fetchRedditSignals';
import { fetchWeatherSignals } from './fetchWeatherSignals';

let cachedWeatherSignals: Signal[] | null = null;

export async function gatherAllSignals(country: string): Promise<Signal[]> {
  const allSignals: Signal[] = [];

  // Fetch and log Reddit signals
  const redditSignals = await fetchRedditSignals(country);
  console.log(`\uD83D\uDD0E️ Reddit Signals for ${country}:`, redditSignals);
  allSignals.push(...redditSignals);

  // Fetch and log Weather signals only once globally
  if (!cachedWeatherSignals) {
    cachedWeatherSignals = await fetchWeatherSignals();

    if (cachedWeatherSignals.length > 0) {
      console.log(`\uD83C\uDF24️ Weather signals found in ${cachedWeatherSignals.length} regions.`);
      for (const signal of cachedWeatherSignals) {
        console.log(` - ${signal.region}: ${signal.content}`);
      }
    } else {
      console.log(`\uD83C\uDF24️ No weather signals detected.`);
    }
  }

  // Push relevant weather signals for this region only
  const regionSignals = cachedWeatherSignals.filter(s => s.region === country);
  allSignals.push(...regionSignals);

  return allSignals;
}