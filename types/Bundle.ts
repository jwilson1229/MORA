// types/Bundle.ts
import { Product } from './Product';

export interface Bundle {
  name: string;
  tags: string[];
  products: Product[];
  totalCost: number;
  totalCostUSD: number;
  profitUSD: number;
  estimatedResale?: number;
  regions: string[];
  problem: string;
  items: number;
  store?: string; // optional override in map
  sourceSignals: string[];
  potentialProfit: number;
  id?: string; // <-- Add this line to allow 'id' in Bundle object
}
