// mora-agro/runAgroReport.ts
import { gatherAllSignals } from './gatherAllSignals';
import { generateSmartBundles } from './bundleEngine';
import { generateReport } from './reportGenerator';
import { Bundle } from '../types/Bundle';

import fs from 'fs';
import { generateSummary } from '../MORA-Voice/generateSummary';
import { textToSpeech } from '../MORA-Voice/textToSpeech';
import { sendVoiceMessage } from '../MORA-Voice/sendVoiceMessage';

console.log('🚜 Starting MORA-Agro Smart Bundle Cycle...');

const regionGroups = [
  {
    name: 'East Africa',
    countries: ['Kenya', 'Uganda', 'Tanzania', 'Ethiopia', 'Rwanda'],
  },
  {
    name: 'West Africa',
    countries: ['Nigeria', 'Ghana', 'Ivory Coast', 'Senegal', 'Cameroon'],
  },
  {
    name: 'South Asia',
    countries: ['India', 'Bangladesh', 'Nepal', 'Sri Lanka', 'Pakistan'],
  },
  {
    name: 'Southeast Asia',
    countries: ['Philippines', 'Vietnam', 'Thailand', 'Indonesia', 'Malaysia'],
  },
  {
    name: 'Latin America',
    countries: ['Brazil', 'Mexico', 'Colombia', 'Peru', 'Argentina'],
  },
  {
    name: 'Middle East',
    countries: ['Egypt', 'Jordan', 'Iraq', 'Saudi Arabia', 'UAE'],
  },
];

const allBundles: Bundle[] = [];

(async () => {
  for (const group of regionGroups) {
    console.log(`\n🌐 Region Group: ${group.name}`);
    for (const country of group.countries) {
      console.log(`🌍 Processing country: ${country}`);
      const signals = await gatherAllSignals(country);
      const bundles = await generateSmartBundles(signals, country);
      allBundles.push(...bundles);
    }
  }

  if (allBundles.length > 0) {
    await generateReport(allBundles);

    const markdown = fs.readFileSync('mora-report.md', 'utf8');
   const summary = await generateSummary(markdown);
const audioBuffer = await textToSpeech(summary);
fs.writeFileSync('mora-voice.ogg', audioBuffer);
await sendVoiceMessage('mora-voice.ogg');


  } else {
    console.log('🛑 No viable bundles found. Report skipped.');
  }

  console.log('✅ MORA-Agro Cycle Complete.');
})();
