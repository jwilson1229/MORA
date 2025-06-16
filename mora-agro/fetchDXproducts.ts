// mora-agro/fetchDXproducts.ts
import { Product } from '../types/Product';

export async function fetchDXproducts(): Promise<Product[]> {
  return [
    {
      name: 'Smart Voltage Detector Pen',
      price: 14.99,
      priceUSD: 14.99,
      quantity: 10,
      url: 'https://example.com/voltage-detector-pen',
      description: 'Non-contact voltage detector with audible and visual alerts.',
      tags: ['voltage', 'detector', 'diagnostic'],
    },
    {
      name: 'Multimeter with Auto-Ranging',
      price: 29.5,
      priceUSD: 29.5,
      quantity: 8,
      url: 'https://example.com/multimeter',
      description: 'Auto-ranging digital multimeter for electrical diagnostics.',
      tags: ['multimeter', 'electrical', 'diagnostics'],
    },
    {
      name: 'Clamp Meter AC/DC',
      price: 46.75,
      priceUSD: 46.75,
      quantity: 4,
      url: 'https://example.com/clamp-meter',
      description: 'Measure current safely with a clamp meter designed for technicians.',
      tags: ['clamp', 'current', 'diagnostics'],
    },
    {
      name: 'Basic Electrical Tool Kit',
      price: 34.25,
      priceUSD: 34.25,
      quantity: 6,
      url: 'https://example.com/electrical-tool-kit',
      description: 'Starter electrical toolkit with pliers, screwdrivers, and tester.',
      tags: ['toolkit', 'starter', 'electrical'],
    },
    {
      name: 'AC Line Tester',
      price: 11.99,
      priceUSD: 11.99,
      quantity: 14,
      url: 'https://example.com/ac-line-tester',
      description: 'Plug-in tester for checking AC power lines and outlets.',
      tags: ['ac', 'tester', 'diagnostics'],
    },
    {
      name: 'Thermal Leak Detector',
      price: 59.99,
      priceUSD: 59.99,
      quantity: 3,
      url: 'https://example.com/thermal-leak-detector',
      description: 'Identify heat loss points in infrastructure or electrical panels.',
      tags: ['thermal', 'leak', 'diagnostic'],
    },
  ];
}
