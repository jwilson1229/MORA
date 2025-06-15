import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

export async function scrapeAlibaba(productName: string) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0 Safari/537.36'
  );

  const url = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(productName)}`;
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  await new Promise(res => setTimeout(res, 5000)); // Let JS finish rendering

  const listings = await page.evaluate(() => {
    const items = document.querySelectorAll('div[data-spm-anchor-id]');
    const results: { title: string; price: string; link: string }[] = [];

    items.forEach((item) => {
      const title = item.querySelector('h2')?.textContent?.trim() || 'No title';
      const price = item.querySelector('.elements-offer-price-normal__price')?.textContent?.trim() || 'No price';
      const link = item.querySelector('a')?.href || '#';
      if (title && price && link) results.push({ title, price, link });
    });

    return results.slice(0, 10);
  });

  await browser.close();
  return listings;
}
