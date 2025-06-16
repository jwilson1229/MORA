import { Bundle } from '../types/Bundle';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function getStoreNameFromBundle(bundle: Bundle): string {
  const problem = bundle.problem.toLowerCase();
  const tags = bundle.tags.map(t => t.toLowerCase());

  if (
    tags.includes('agriculture') ||
    tags.includes('irrigation') ||
    tags.includes('soil') ||
    tags.includes('temperature') ||
    tags.includes('moisture') ||
    tags.includes('climate') ||
    problem.includes('drought') ||
    problem.includes('frost') ||
    problem.includes('extreme heat')
  ) 
    return 'MORA-AGTECH';

  if (tags.includes('solar') || tags.includes('solar panel') || tags.includes('off-grid')) {
    return 'MORA-SOLAR';
  }

  if (tags.includes('water') || tags.includes('filtration') || tags.includes('pump') || tags.includes('hydration')) {
    return 'MORA-WATER';
  }

  if (tags.includes('dx') || tags.includes('diagnostic') || tags.includes('sensor') || tags.includes('monitoring')) {
    return 'MORA-DX';
  }

  if (tags.includes('stem') || tags.includes('lab') || tags.includes('education') || tags.includes('science')) {
    return 'MORA-STEM';
  }

  return 'MORA-GENERAL';
}

function formatGroupedBundleMarkdown(bundle: Bundle): string {
  const productList = bundle.products
    .map(p => `- ${p.name} — ${formatCurrency(p.priceUSD)}`)
    .join('\n');

  const regions = Array.isArray(bundle.regions) ? bundle.regions.join(', ') : bundle.regions;
  const sources = Array.isArray(bundle.sourceSignals) ? bundle.sourceSignals.join(', ') : bundle.sourceSignals;
  const sourceLinks = Array.isArray(bundle.sourceSignals)
    ? bundle.sourceSignals.filter(s => s.startsWith('http')).join(', ')
    : '';

  return `**📦 ${bundle.name}**
**🆔 ID:** \`${bundle.id}\`
**🌍 Regions:** ${regions}
**📶 Signals:** ${sources}
**🌾 Problem:** ${bundle.problem}
**🛠️ Tags:** ${bundle.tags.join(', ')}

**🧠 Matched Products:**
${productList}

💰 **Total Cost:** ${formatCurrency(bundle.totalCostUSD)}
📈 **Estimated Resale:** ${formatCurrency(bundle.estimatedResale || 0)}
💸 **Estimated Profit:** ${formatCurrency(bundle.profitUSD)}
📰 **Sources:** ${sourceLinks || 'N/A'}`;
}

async function sendTelegramMessage(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('❌ Telegram credentials missing in environment variables.');
    return;
  }

  try {
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
    });
    console.log('✅ Telegram report sent.');
  } catch (error) {
    console.error('❌ Failed to send Telegram message:', error);
  }
}

function groupBundlesByStoreAndName(bundles: Bundle[]): Record<string, Map<string, Bundle>> {
  const storeMap: Record<string, Map<string, Bundle>> = {};

  for (const bundle of bundles) {
    const store = getStoreNameFromBundle(bundle);
    if (!storeMap[store]) {
      storeMap[store] = new Map();
    }

    const storeBundles = storeMap[store];
    const key = bundle.name;

    if (storeBundles.has(key)) {
      const existing = storeBundles.get(key)!;
      existing.regions = Array.from(new Set([...existing.regions, ...bundle.regions]));
      existing.sourceSignals = Array.from(new Set([...existing.sourceSignals, ...bundle.sourceSignals]));
    } else {
      storeBundles.set(key, { ...bundle });
    }
  }

  return storeMap;
}

export async function generateReport(bundles: Bundle[]) {
  if (!bundles.length) {
    await sendTelegramMessage('📭 No viable bundles found for today.');
    return;
  }

  const grouped = groupBundlesByStoreAndName(bundles);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join('reports', `agro-report-${timestamp}.md`);
  const fullReport: string[] = [];

  for (const [store, bundleMap] of Object.entries(grouped)) {
    const sectionHeader = `### ✅ MORA Report: ${store}`;
    const sectionBundles = Array.from(bundleMap.values()).map(formatGroupedBundleMarkdown).join('\n\n');
    const fullSection = `${sectionHeader}\n\n${sectionBundles}`;
    fullReport.push(fullSection);

    await sendTelegramMessage(fullSection);
  }

  const fullMarkdown = fullReport.join('\n\n---\n\n');
  fs.writeFileSync(reportPath, fullMarkdown);
  fs.writeFileSync('mora-report.md', fullMarkdown); // ✅ Write MORA’s readable markdown file

  console.log(`📝 MORA Agro report saved: ${reportPath}`);
}