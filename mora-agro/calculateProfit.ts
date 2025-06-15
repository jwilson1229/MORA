import { Product } from '../types/Product';

export function calculateProfit(products: Product[]): {
  profitUSD: number;
  estimatedResale: number;
} {
  const totalCost = products.reduce((sum, p) => sum + p.priceUSD, 0);
  const estimatedResale = totalCost * 1.6; // 60% ROI
  const profitUSD = estimatedResale - totalCost;

  return { profitUSD, estimatedResale };
}
