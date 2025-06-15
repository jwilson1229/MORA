import fs from 'fs';
import path from 'path';
import { scrapeAlibaba } from './alibaba';
import { searchEbay } from './ebay';

export type DotmedListing = {
  title: string;
  price: string;
  link: string;
};

export type ResaleReport = {
  title: string;
  dotmedPrice: number;
  dotmedLink: string;
  ebayAvg: number;
  ebayLowest: number;
  alibabaOptions: { title: string; price: string; link: string }[];
  estimatedProfit: number;
};

function parsePrice(priceStr: string): number {
  const parsed = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
}

export async function matchResalePrices(): Promise<ResaleReport[]> {
  const listingsPath = path.join(__dirname, '../../data/filtered_listings.json');
  const rawData = fs.readFileSync(listingsPath, 'utf-8');
  const dotmedListings: DotmedListing[] = JSON.parse(rawData);

  const results: ResaleReport[] = [];

  for (const item of dotmedListings) {
    const dotmedPrice = parsePrice(item.price);
    const ebay = await searchEbay(item.title);
    const alibaba = await scrapeAlibaba(item.title);

    const bestEbayPrice = ebay.avgPrice * 0.85; //here we are accounting for ebays 15% fee
    const estimatedProfit = parseFloat((bestEbayPrice - dotmedPrice).toFixed(2));

    if (estimatedProfit > 0) {
      results.push({
        title: item.title,
        dotmedPrice,
        dotmedLink: item.link,
        ebayAvg: ebay.avgPrice,
        ebayLowest: bestEbayPrice,
        alibabaOptions: alibaba,
        estimatedProfit,
      });
      console.log(`📦 Compared: ${item.title} — Potential profit: $${estimatedProfit}`);
    }
  }

  const outputPath = path.join(__dirname, '../../data/resale_report.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`✅ Saved resale report to: ${outputPath}`);

  return results;
}