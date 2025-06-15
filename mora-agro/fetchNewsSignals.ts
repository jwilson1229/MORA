// fetchNewsSignals.ts
export async function fetchNewsSignals(region: string): Promise<string[]> {
  console.log(`⚠️ News signals disabled for region: ${region}`);
  return []; // Return an empty list to simulate no news signals from this source
}
