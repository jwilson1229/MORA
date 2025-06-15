import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
const BASE_URL = 'https://www.dotmed.com/equipment/';

async function getCategoryLinks(): Promise<string[]> {
  const res = await axios.get(BASE_URL);
  const $ = cheerio.load(res.data);
  const links: string[] = [];

  $('a').each((_, el) => {
    const href = $(el).attr('href');
    if (href?.startsWith('/browse/equipment/') && !links.includes(href)) {
      links.push(`https://www.dotmed.com${href}`);
    }
  });

  return links;
}

async function scrapeListingsFromCategory(url: string) {
  const listings: any[] = [];
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);

    $('.listing-list').each((_, el) => {
      const title = $(el).find('.listing-text a').text().trim();
      const priceText = $(el).text().match(/\$\d+(,\d{3})*/);
      const price = priceText ? priceText[0] : 'N/A';
      const link = 'https://www.dotmed.com' + $(el).find('.listing-text a').attr('href');

      if (title && link) {
        listings.push({ title, price, link });
      }
    });

    return listings;
  } catch (err) {
    console.warn(`⚠️ Failed to scrape category: ${url}`);
    return [];
  }
}

 async function scrapeDotMedAll() {
  const categories = await getCategoryLinks();
  let allListings: any[] = [];

  for (const url of categories) {
    const categoryListings = await scrapeListingsFromCategory(url);
    allListings = allListings.concat(categoryListings);
  }

  await fs.writeFile('dotmed_all_listings.json', JSON.stringify(allListings, null, 2));
  console.log(`✅ Scraped ${allListings.length} listings from all categories.`);
}

 export {scrapeDotMedAll};
