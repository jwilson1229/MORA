// mora-agro/fetchWaterProducts.ts
import { Product } from '../types/Product';

export async function fetchWaterProducts(): Promise<Product[]> {
  return [
    {
      name: 'Solar Water Pump Kit 12V',
      price: 89.99,
      priceUSD: 89.99,
      quantity: 5,
      url: 'https://example.com/solar-water-pump-kit',
      description: 'Compact solar-powered water pump ideal for small farms and off-grid irrigation.',
      tags: ['water', 'pump', 'solar', 'irrigation'],
    },
    {
      name: 'Manual Hand Pump',
      price: 28.5,
      priceUSD: 28.5,
      quantity: 12,
      url: 'https://example.com/manual-hand-pump',
      description: 'Reliable hand-operated water pump for rural or emergency use.',
      tags: ['manual', 'pump', 'emergency', 'rural'],
    },
    {
      name: 'Inline Water Filter Kit',
      price: 39.95,
      priceUSD: 39.95,
      quantity: 7,
      url: 'https://example.com/inline-water-filter',
      description: 'Removes contaminants from well or stream water for irrigation or livestock.',
      tags: ['filtration', 'water', 'kit'],
    },
    {
      name: 'Ceramic Gravity Water Filter System',
      price: 64.75,
      priceUSD: 64.75,
      quantity: 4,
      url: 'https://example.com/ceramic-water-filter',
      description: 'Gravity-fed ceramic filter for producing clean drinking water in rural areas.',
      tags: ['filtration', 'ceramic', 'gravity', 'clean water'],
    },
    {
      name: 'Irrigation Timer 24hr',
      price: 19.99,
      priceUSD: 19.99,
      quantity: 15,
      url: 'https://example.com/irrigation-timer',
      description: 'Programmable irrigation timer for efficient water usage.',
      tags: ['irrigation', 'automation', 'timer'],
    },
    {
      name: 'Water Quality Test Strips (100ct)',
      price: 15.99,
      priceUSD: 15.99,
      quantity: 20,
      url: 'https://example.com/water-test-strips',
      description: 'Simple water testing solution for pH, chlorine, and hardness.',
      tags: ['water quality', 'test', 'pH', 'chlorine'],
    },
  ];
}
