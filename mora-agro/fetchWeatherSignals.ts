import axios from 'axios';
import { Signal } from '../types/Signal';
import dotenv from 'dotenv';
dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY as string;

type RegionCoord = {
  name: string;
  lat: number;
  lon: number;
};

const regions: RegionCoord[] = [
  { name: 'Kenya', lat: -1.2921, lon: 36.8219 },
  { name: 'Uganda', lat: 1.3733, lon: 32.2903 },
  { name: 'Nigeria', lat: 9.082, lon: 8.6753 },
  { name: 'Philippines', lat: 13.41, lon: 122.56 },
  { name: 'India', lat: 20.5937, lon: 78.9629 },
  { name: 'Bangladesh', lat: 23.685, lon: 90.3563 },
  { name: 'Nepal', lat: 28.3949, lon: 84.124 },
  { name: 'Sri Lanka', lat: 7.8731, lon: 80.7718 },
  { name: 'Pakistan', lat: 30.3753, lon: 69.3451 },
  { name: 'Vietnam', lat: 14.0583, lon: 108.2772 },
  { name: 'Thailand', lat: 15.87, lon: 100.9925 },
  { name: 'Indonesia', lat: -0.7893, lon: 113.9213 },
  { name: 'Malaysia', lat: 4.2105, lon: 101.9758 },
  { name: 'Brazil', lat: -14.235, lon: -51.9253 },
  { name: 'Mexico', lat: 23.6345, lon: -102.5528 },
  { name: 'Colombia', lat: 4.5709, lon: -74.2973 },
  { name: 'Peru', lat: -9.19, lon: -75.0152 },
  { name: 'Argentina', lat: -38.4161, lon: -63.6167 },
  { name: 'Egypt', lat: 26.8206, lon: 30.8025 },
  { name: 'Jordan', lat: 30.5852, lon: 36.2384 },
  { name: 'Iraq', lat: 33.3152, lon: 44.3661 },
  { name: 'Saudi Arabia', lat: 23.8859, lon: 45.0792 },
  { name: 'UAE', lat: 23.4241, lon: 53.8478 },
];

export async function fetchWeatherSignals(): Promise<Signal[]> {
  const signals: Signal[] = [];

  await Promise.all(
    regions.map(async (region) => {
      try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${region.lat}&lon=${region.lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await axios.get(url);
        const alerts = detectWeatherAlerts(response.data);

        for (const alert of alerts) {
          let cleanLabel = alert;
          let mappedProblem = '';

          switch (alert) {
            case 'extreme heat risk':
              cleanLabel = 'Extreme Heat';
              mappedProblem = 'Extreme Heat';
              break;
            case 'frost risk':
              cleanLabel = 'Frost';
              mappedProblem = 'Frost';
              break;
            case 'weather instability':
              cleanLabel = 'Weather Instability';
              mappedProblem = 'weather instability';
              break;
            case 'solar underperformance risk':
              cleanLabel = 'Cloud Risk';
              mappedProblem = 'cloud risk';
              break;
            case 'storm risk to solar panels':
              cleanLabel = 'Storm Damage Risk';
              mappedProblem = 'storm damage risk';
              break;
            case 'power outage risk':
              cleanLabel = 'Power Outage Risk';
              mappedProblem = 'grid failure';
              break;
            default:
              cleanLabel = alert;
              mappedProblem = alert;
          }

          signals.push({
            region: region.name,
            type: 'weather',
            source: 'openweathermap',
            indicators: [cleanLabel],
            message: undefined,
            problem: mappedProblem,
            content: cleanLabel,
            tags: [cleanLabel],
            url: `https://openweathermap.org/city/${region.lat},${region.lon}`,
          });
        }
      } catch (err: any) {
        console.error(`❌ Weather API error [${region.name}]:`, err.message);
      }
    })
  );

  return signals;
}

function detectWeatherAlerts(data: any): string[] {
  const temps: number[] = data.list?.map((entry: any) => entry.main?.temp).filter((t: any) => typeof t === 'number') || [];
  const cloudiness: number[] = data.list?.map((entry: any) => entry.clouds?.all).filter((c: any) => typeof c === 'number') || [];
  const windSpeeds: number[] = data.list?.map((entry: any) => entry.wind?.speed).filter((w: any) => typeof w === 'number') || [];

  const alerts: string[] = [];

  if (temps.some(temp => temp > 38)) alerts.push('extreme heat risk');
  if (temps.some(temp => temp < 0)) alerts.push('frost risk');
  if (Math.max(...temps) - Math.min(...temps) > 25) alerts.push('weather instability');

  // ☁️ Cloudiness harms solar efficiency
  const avgCloudCover = cloudiness.reduce((a, b) => a + b, 0) / (cloudiness.length || 1);
  if (avgCloudCover > 75) alerts.push('solar underperformance risk');

  // 💨 Wind threats to panels
  if (windSpeeds.some(w => w > 14)) alerts.push('storm risk to solar panels');

  // 🔌 Heat-induced blackouts
  if (temps.some(temp => temp > 40)) alerts.push('power outage risk');

  return alerts;
}
