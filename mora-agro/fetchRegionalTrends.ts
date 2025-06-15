// fetchRegionalTrends.ts
export async function fetchRegionalTrends(region: string): Promise<string[]> {
  console.log(`⚠️ Google Trends disabled for region: ${region}`);
  return []; // Return an empty list to simulate no trends from this source
}
