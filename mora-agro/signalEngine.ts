// signalEngine.ts
import { fetchRedditSignals } from './fetchRedditSignals';
import { fetchWeatherSignals } from './fetchWeatherSignals';
import { regionGroups } from './regionGroups';
import { Signal } from '../types/Signal';

export async function gatherSignals(): Promise<Signal[]> {
  const allCountries = Object.values(regionGroups).flat();
  const [weatherSignals] = await Promise.all([
    safeFetchNoArg(fetchWeatherSignals),
    // TEMPORARILY DISABLED: safeFetchWithArg(fetchEventRegistrySignals, region)
  ]);
  const allSignals: Signal[] = [];

  for (const country of allCountries) {
    const redditSignals = await safeFetchWithArg(fetchRedditSignals, country);
    const signals = [
      ...redditSignals,
      ...weatherSignals.filter(ws => ws.region === country)
    ];

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

async function safeFetchNoArg(
  fetchFn: () => Promise<Signal[]>
): Promise<Signal[]> {
  try {
    const data = await fetchFn();
    return Array.isArray(data) && data.every(isSignal) ? data : [];
  } catch (err) {
    console.warn(`⚠️ Failed to fetch signals from ${fetchFn.name}`, err);
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
