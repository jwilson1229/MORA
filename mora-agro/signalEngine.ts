import { fetchRedditSignals } from './fetchRedditSignals';
import { fetchWeatherSignals } from './fetchWeatherSignals';
import { fetchNewsSignals } from './fetchNewsSignals';
import { regionGroups } from './regionGroups';
import { Signal } from '../types/Signal';

export async function gatherSignals(): Promise<Signal[]> {
  const allCountries = Object.values(regionGroups).flat();
  const allSignals: Signal[] = [];

  for (const country of allCountries) {
    const [redditSignals, weatherSignals, newsSignals] = await Promise.all([
      safeFetchWithArg(fetchRedditSignals, country),
      safeFetchWithArg(fetchWeatherSignals, country),
      safeFetchWithArg(fetchNewsSignals, country),
    ]);

    const signals = [...redditSignals, ...weatherSignals, ...newsSignals];

    for (const signal of signals) {
      const isDuplicate = allSignals.some(s =>
        s.content === signal.content && s.region === signal.region
      );

      if (!isDuplicate) {
        allSignals.push({
          ...signal,
          message: `${signal.indicators.join(', ')}: ${signal.source} (${signal.region})`,
        });
      }
    }
  }

  return allSignals;
}

async function safeFetchWithArg(
  fetchFn: (region: string) => Promise<Signal[]>,
  region: string
): Promise<Signal[]> {
  try {
    const data = await fetchFn(region);
    return Array.isArray(data) && data.every(isSignal) ? data : [];
  } catch (err) {
    console.warn(`⚠️ Failed to fetch signals from ${fetchFn.name} for region ${region}`, err);
    return [];
  }
}

function isSignal(item: any): item is Signal {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof item.source === 'string' &&
    typeof item.region === 'string' &&
    typeof item.content === 'string' &&
    Array.isArray(item.indicators)
  );
}
