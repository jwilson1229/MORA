import fs from 'fs';

function random<T>(options: T[]): T {
  return options[Math.floor(Math.random() * options.length)];
}

function extractBundles(markdown: string): string[] {
  return markdown.split(/---+/g).map(block => block.trim()).filter(Boolean);
}

function parseBundle(bundleText: string) {
  const nameMatch = bundleText.match(/\*\*📦 (.*?)\*\*/);
  const regionsMatch = bundleText.match(/\*\*🌍 Regions:\*\* (.*)/);
  const problemMatch = bundleText.match(/\*\*🌾 Problem:\*\* (.*)/);
  const profitMatch = bundleText.match(/\*\*Estimated Profit:\*\* \$(\d+\.\d+)/);
  const sourceMatch = bundleText.match(/\*\*Sources:\*\* (.*)/);

  return {
    name: nameMatch?.[1]?.trim() || 'Unnamed Bundle',
    regions: regionsMatch?.[1]?.split(',').map(r => r.trim()) || [],
    problem: problemMatch?.[1]?.trim() || '',
    profit: parseFloat(profitMatch?.[1] || '0'),
    source: sourceMatch?.[1]?.trim() || null
  };
}

export function generateSummary(markdown: string): string {
  const bundles = extractBundles(markdown);
  if (bundles.length === 0) return "No bundles found to report.";

  const selected = parseBundle(random(bundles));

  const intro = random([
    "Alright Jacob, here’s a standout pick.",
    "Yo boss — quick highlight for you.",
    "Hey Jacob, got a solid one today.",
    "Bundle drop incoming."
  ]);

  const regionText = selected.regions.slice(0, 2).join(', ') + (selected.regions.length > 2 ? ', etc.' : '');
  const profitComment = selected.profit > 100
    ? "Big gains. Just your style."
    : selected.profit > 50
    ? "Good margin here."
    : "Low cost, clever return.";

  const summary = `${intro} "${selected.name}" targets ${regionText}. Problem? ${selected.problem}. ${profitComment}`;

  // Truncate to 200 just in case
  return summary.length > 200 ? summary.slice(0, 197) + "..." : summary;
}
