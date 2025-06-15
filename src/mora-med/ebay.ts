import axios from 'axios';
import * as cheerio from 'cheerio';

export type EbaySearchResult = {
  avgPrice: number;
  lowest: number;
  listings: string[];
};

export async function searchEbay(title: string): Promise<EbaySearchResult> {
  const query = encodeURIComponent(title);
  const url = `https://www.ebay.com/sch/i.html?_nkw=${query}&_sop=12&_ipg=10`; // Sort by Price + Shipping: lowest first

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const prices: number[] = [];
    const listings: string[] = [];

    $('li.s-item').each((_, el) => {
      const priceText = $(el).find('.s-item__price').first().text();
      const link = $(el).find('.s-item__link').attr('href');

      const match = priceText.replace(/[^0-9.]/g, '');
      const price = parseFloat(match);

      if (!isNaN(price) && price > 0) {
        prices.push(price);
        if (link) listings.push(link);
      }
    });

    if (prices.length === 0) return { avgPrice: 0, lowest: 0, listings: [] };

    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const lowest = Math.min(...prices);

    return {
      avgPrice: parseFloat(avgPrice.toFixed(2)),
      lowest,
      listings
    };
  } catch (err) {
    console.error('❌ eBay fetch failed:', err);
    return { avgPrice: 0, lowest: 0, listings: [] };
  }
}
