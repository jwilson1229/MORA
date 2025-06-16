import { Signal } from '../types/Signal';
import { Bundle } from '../types/Bundle';
import { fetchSeeedProducts } from '../mora-agro/fetchSeeedProducts';
import { fetchSolarProducts } from '../mora-agro/fetchSolarProducts';
import { fetchWaterProducts } from './fetchWaterProducts';
import { fetchDXproducts } from './fetchDXproducts';
import { fetchStemProducts } from './fetchStemProducts';
import { problemSolutionMap } from './problemSolutionsMap';
import { calculateProfit } from './calculateProfit';
import { v4 as uuidv4 } from 'uuid';

export async function generateSmartBundles(signals: Signal[], country: string): Promise<Bundle[]> {
  const allProducts = {
    ag: await fetchSeeedProducts(),
    solar: await fetchSolarProducts(),
    water: await fetchWaterProducts(),
    dx: await fetchDXproducts(),
    stem: await fetchStemProducts()
  };

  const bundles: Bundle[] = [];

  for (const signal of signals) {
    const { content: rawProblem, region, source } = signal;
    const normalizedProblem = rawProblem.toLowerCase().trim();

    console.log(`🔍 Checking signal: "${normalizedProblem}"`);

    const matchedEntry = Object.entries(problemSolutionMap).find(
      ([key]) => key.toLowerCase().trim() === normalizedProblem
    );

    if (!matchedEntry) {
      console.log(`❌ No matching bundle entry for: "${normalizedProblem}"`);
      continue;
    }

    const [problemKey, solutions] = matchedEntry;

    for (const solution of solutions) {
      const storeKey = solution.store?.toLowerCase().trim() as keyof typeof allProducts;
      const products = allProducts[storeKey];

      if (!products || !Array.isArray(products)) {
        console.warn(`⚠️ Invalid or missing product list for store "${solution.store}". Skipping solution.`);
        continue;
      }

      const matchedProducts = solution.requiredProductNames
        .map(reqName =>
          products.find(
            p => p.name.toLowerCase() === reqName.toLowerCase() && p.quantity > 0
          )
        )
        .filter((p): p is NonNullable<typeof p> => !!p);

      if (matchedProducts.length !== solution.requiredProductNames.length) {
        console.log(`⚠️ Not all required products found or in stock for "${solution.bundleName}". Needed: ${solution.requiredProductNames.join(', ')}`);
        continue;
      }

      const totalCost = matchedProducts.reduce((sum, p) => sum + p.priceUSD, 0);
      const { profitUSD, estimatedResale } = calculateProfit(matchedProducts);

      const existingBundle = bundles.find(
        b => b.name === solution.bundleName && b.store === solution.store
      );

      if (existingBundle) {
        if (!existingBundle.regions.includes(region)) {
          existingBundle.regions.push(region);
        }
        if (!existingBundle.sourceSignals.includes(source)) {
          existingBundle.sourceSignals.push(source);
        }
        continue;
      }

      const bundle: Bundle = {
        id: uuidv4(),
        name: solution.bundleName,
        tags: solution.tags,
        products: matchedProducts,
        totalCost,
        totalCostUSD: totalCost,
        profitUSD,
        estimatedResale,
        regions: [region],
        problem: problemKey,
        items: matchedProducts.length,
        sourceSignals: [source],
        potentialProfit: profitUSD,
        store: solution.store,
      };

      console.log(`✅ Bundle created: "${bundle.name}" for region ${region}`);
      bundles.push(bundle);
    }
  }

  return bundles;
}
