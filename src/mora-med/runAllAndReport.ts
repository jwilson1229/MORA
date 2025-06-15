import fs from 'fs';
import path from 'path';
import { scrapeDotMedAll } from './dotmed';
import { filterListings } from '../filtering/filterListings';
import { matchResalePrices } from '../comparison/matchResalePrices';

async function runAllAndGenerateReport() {
  console.log('🚀 Starting full MORA cycle...');

  // Step 1: Scrape DotMed
  await scrapeDotMedAll();

  // Step 2: Filter Listings
  const filtered = await filterListings();
  const filteredPath = path.join(__dirname, '../data/filtered_listings.json');
  fs.writeFileSync(filteredPath, JSON.stringify(filtered, null, 2));
  console.log(`✅ Saved ${filtered.length} filtered listings to filtered_listings.json`);

  // Step 3: Match Resale Prices & Compute Profit
  const profitableDeals = await matchResalePrices();
  const resalePath = path.join(__dirname, '../data/resale_report.json');
  fs.writeFileSync(resalePath, JSON.stringify(profitableDeals, null, 2));
  console.log(`✅ Saved resale report to: ${resalePath}`);

  // Step 4: Generate Markdown Report
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 12);
  const markdownLines: string[] = [
    `# MORA Arbitrage Report - ${new Date().toLocaleString()}`,
    '',
    '---',
    '',
    profitableDeals.length === 0 ? '_No profitable deals found this hour._' : '**Top Resale Opportunities:**',
    ''
  ];

  for (const deal of profitableDeals) {
    markdownLines.push(`## ${deal.title}`);
    markdownLines.push(`- DotMed: [$${deal.dotmedPrice}](${deal.dotmedLink})`);
    markdownLines.push(`- eBay Avg: $${deal.ebayAvg} | Lowest: $${deal.ebayLowest}`);
    if (deal.alibabaOptions.length) {
      markdownLines.push(`- Alibaba: ` + deal.alibabaOptions.map(p => `[$${p.price}](${p.link})`).join(', '));
    }
    markdownLines.push(`- **Estimated Profit:** $${deal.estimatedProfit}`);
    markdownLines.push('');
  }

  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
  const reportPath = path.join(reportsDir, `report-${timestamp}.md`);
  fs.writeFileSync(reportPath, markdownLines.join('\n'));

  console.log(`📝 Markdown report saved to: ${reportPath}`);
}

runAllAndGenerateReport();