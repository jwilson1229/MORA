import { Product } from '../types/Product';

/**
 * Simulated solar product inventory for MORA-SOLAR testing
 */
export async function fetchSolarProducts(): Promise<Product[]> {
  return [
    {
      name: '100W Foldable Solar Panel',
      price: 209.99,
      priceUSD: 209.99,
      quantity: 10,
      url: 'https://www.solarstudio.com/100W-Foldable-Solar-Panel.html',
      description: 'Portable and durable solar panel for off-grid energy generation',
      tags: ['solar', 'panel', 'portable', 'off-grid', 'power'],
    },
    {
      name: 'MPPT Solar Charge Controller',
      price: 75.99,
      priceUSD: 75.99,
      quantity: 15,
      url: 'https://www.solarstudio.com/MPPT-Solar-Charge-Controller.html',
      description: 'Maximizes efficiency of solar power charging systems',
      tags: ['solar', 'controller', 'battery', 'charger', 'mppt'],
    },
    {
      name: '12V 50Ah LiFePO4 Battery',
      price: 289.0,
      priceUSD: 289.0,
      quantity: 8,
      url: 'https://www.solarstudio.com/12V-50Ah-LiFePO4-Battery.html',
      description: 'Long-life lithium battery ideal for solar storage systems',
      tags: ['battery', 'solar', 'storage', 'lifepo4', 'power'],
    },
    {
      name: 'DC-AC Pure Sine Wave Inverter 1000W',
      price: 85.5,
      priceUSD: 85.5,
      quantity: 10,
      url: 'https://www.solarstudio.com/Solar-Inverter-1000W.html',
      description: 'Converts DC to AC for household appliances from solar batteries',
      tags: ['inverter', 'ac', 'dc', 'solar', 'conversion'],
    },
    {
      name: 'Off-Grid Power Monitor Kit',
      price: 65.99,
      priceUSD: 65.99,
      quantity: 20,
      url: 'https://www.solarstudio.com/Off-Grid-Power-Monitor-Kit.html',
      description: 'Tracks and logs power production and usage in solar setups',
      tags: ['monitor', 'power', 'solar', 'data', 'tracking'],
    },
    {
      name: 'IoT Solar Controller with WiFi',
      price: 76.99,
      priceUSD: 76.99,
      quantity: 12,
      url: 'https://www.solarstudio.com/IoT-Solar-Controller.html',
      description: 'Allows remote solar management and data access via mobile apps',
      tags: ['solar', 'iot', 'controller', 'wifi', 'monitoring'],
    },
    {
      name: 'Solar Panel Mounting Brackets (Adjustable)',
      price: 18.0,
      priceUSD: 18.0,
      quantity: 30,
      url: 'https://www.solarstudio.com/Solar-Mounting-Kit.html',
      description: 'Hardware for securely installing solar panels with adjustable tilt',
      tags: ['solar', 'mounting', 'brackets', 'hardware'],
    },
    {
      name: 'Solar-Powered LED Flood Light Kit',
      price: 69.99,
      priceUSD: 69.99,
      quantity: 25,
      url: 'https://www.solarstudio.com/Solar-Flood-Light.html',
      description: 'Weatherproof flood light system powered entirely by solar',
      tags: ['solar', 'light', 'led', 'floodlight', 'outdoor'],
    },
    {
      name: 'Mini Solar Power Starter Kit (Educational)',
      price: 54.99,
      priceUSD: 54.99,
      quantity: 40,
      url: 'https://www.solarstudio.com/Mini-Solar-Starter-Kit.html',
      description: 'Educational solar kit for classrooms and STEM learning',
      tags: ['solar', 'education', 'stem', 'starter', 'kit'],
    },
    {
      name: 'USB Solar Charging Hub (5-Port)',
      price: 68.5,
      priceUSD: 68.5,
      quantity: 16,
      url: 'https://www.solarstudio.com/USB-Solar-Charging-Hub.html',
      description: 'Solar-powered hub for charging multiple USB devices simultaneously',
      tags: ['solar', 'charging', 'usb', 'hub', 'off-grid'],
    },
  ];
}
