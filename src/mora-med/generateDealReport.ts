import { scrapeAlibaba } from './alibaba';
import { searchEbay } from '../pricing/ebay';
import path from 'path';
import fs from 'fs';


interface DotmedProduct {
  title: string;
  price: string;
  link: string;
}

interface ComparisonResult {
  title: string;
  dotmedPrice: number;
  alibabaPrices: { price: string; link: string }[];
  ebay: { avgPrice: number; lowest: number; listings: string[] };
  potentialProfit: number;
}

const filePath = path.join(__dirname, '../../data/filtered_listings.json');
const rawData = fs.readFileSync(filePath, 'utf-8');
const filteredProducts: DotmedProduct[] = JSON.parse(rawData);

export async function runComparison(): Promise<ComparisonResult[]> {
  const results: ComparisonResult[] = [];

  for (const product of filteredProducts) {
    const cleanTitle = product.title.replace(/For Sale view more/i, '').trim();
    const dotmedPrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));

    console.log(`\n🔍 Comparing resale options for: ${cleanTitle}`);

    try {
      const alibabaListings = await scrapeAlibaba(cleanTitle);
      const ebayData = await searchEbay(cleanTitle);

      const alibabaPrices = alibabaListings.map((item) => ({
        price: item.price,
        link: item.link.startsWith('http') ? item.link : `https:${item.link}`
      }));

      const avgAlibabaPrice = alibabaPrices
        .map((item) => parseFloat(item.price.replace(/[^0-9.]/g, '')))
        .filter((num) => !isNaN(num))
        .reduce((acc, val, _, arr) => acc + val / arr.length, 0);

      const bestResalePrice = Math.max(ebayData.avgPrice, avgAlibabaPrice);
      const potentialProfit = parseFloat((bestResalePrice - dotmedPrice).toFixed(2));

      console.log(`   DotMed: $${dotmedPrice.toFixed(2)}`);
      console.log(`   eBay Avg: $${ebayData.avgPrice.toFixed(2)}, Lowest: $${ebayData.lowest.toFixed(2)}`);
      console.log(`   Alibaba Avg: $${avgAlibabaPrice.toFixed(2)}`);
      console.log(`   Potential Profit: $${potentialProfit.toFixed(2)}\n`);

      results.push({
        title: cleanTitle,
        dotmedPrice,
        alibabaPrices,
        ebay: ebayData,
        potentialProfit
      });
    } catch (err) {
      console.error(`❌ Comparison failed for: ${cleanTitle}`, err);
    }
  }

  return results;
}

// Run the comparison report
runComparison();