import * as fs from 'fs';
import * as path from 'path';

export interface Listing {
  title: string;
  price: string;
  category: string;
  location: string;
  detailsUrl: string;
  imageUrl: string;
}

function parsePrice(priceStr: string): number | null {
  const match = priceStr.match(/[\d,.]+/g);
  if (!match) return null;
  const cleaned = match[0].replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

function loadListings(): Listing[] {
  const filePath = path.resolve(__dirname, '../../data/dotmed_all_listings.json');
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

function saveFilteredListings(listings: Listing[]) {
  const filePath = path.resolve(__dirname, '../../data/filtered_listings.json');
  fs.writeFileSync(filePath, JSON.stringify(listings, null, 2));
  console.log(`✅ Saved ${listings.length} filtered listings to filtered_listings.json`);
}

function isValidListing(listing: Listing): boolean {
  const price = parsePrice(listing.price);
  const title = listing.title.toLowerCase();
  const priceStr = listing.price.toLowerCase();

  const forbiddenPriceTerms = ['call', 'bid', 'starting', 'auction', 'contact', 'n/a'];
  const forbiddenTitleTerms = ['auction', 'bid', 'lot'];

  const isBuyNowPrice = !forbiddenPriceTerms.some(term => priceStr.includes(term));
  const isBuyNowTitle = !forbiddenTitleTerms.some(term => title.includes(term));

  const keywords = ['monitor', 'ultrasound', 'defibrillator', 'ecg', 'system', 'analyzer'];

  return (
    price !== null &&
    price >= 50 &&
    price <= 5000 &&
    isBuyNowPrice &&
    isBuyNowTitle &&
    keywords.some((kw) => title.includes(kw))
  );
}

// ✅ Exported version for importing elsewhere
export function filterListings(): Listing[] {
  const listings = loadListings();
  const filtered = listings.filter(isValidListing);
  saveFilteredListings(filtered);
  return filtered;
}

// ✅ Optional: run directly via CLI
if (require.main === module) {
  filterListings();
}
