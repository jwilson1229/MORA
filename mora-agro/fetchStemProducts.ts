// mora-agro/fetchStemProducts.ts
import { Product } from '../types/Product';

export async function fetchStemProducts(): Promise<Product[]> {
  return [
    {
      name: 'Arduino Uno R3 Starter Kit',
      price: 54.99,
      priceUSD: 54.99,
      quantity: 5,
      url: 'https://example.com/arduino-starter-kit',
      description: 'Complete Arduino learning kit for electronics and coding education.',
      tags: ['arduino', 'stem', 'electronics'],
    },
    {
      name: 'Basic Solar Power DIY Kit',
      price: 24.99,
      priceUSD: 24.99,
      quantity: 10,
      url: 'https://example.com/solar-diy-kit',
      description: 'Learn renewable energy concepts by building your own solar-powered circuit.',
      tags: ['solar', 'stem', 'diy'],
    },
    {
      name: 'Portable Microscope Kit for Students',
      price: 39.99,
      priceUSD: 39.99,
      quantity: 6,
      url: 'https://example.com/student-microscope-kit',
      description: 'Educational microscope kit for basic biology and observation.',
      tags: ['biology', 'microscope', 'education'],
    },
    {
      name: 'Breadboard and Jumper Wire Set',
      price: 11.99,
      priceUSD: 11.99,
      quantity: 20,
      url: 'https://example.com/breadboard-set',
      description: 'Prototyping set with breadboard and wires for electronic experiments.',
      tags: ['electronics', 'prototype', 'wiring'],
    },
    {
      name: 'STEM Robotics Kit with Sensors',
      price: 74.99,
      priceUSD: 74.99,
      quantity: 3,
      url: 'https://example.com/stem-robot-kit',
      description: 'Build and program simple robots with sensors and motors.',
      tags: ['robotics', 'stem', 'coding'],
    },
    {
      name: 'Raspberry Pi Pico with Accessories',
      price: 18.5,
      priceUSD: 18.5,
      quantity: 15,
      url: 'https://example.com/raspberry-pi-pico',
      description: 'Tiny but powerful board for embedded systems and student projects.',
      tags: ['raspberry', 'microcontroller', 'education'],
    },
  ];
}
