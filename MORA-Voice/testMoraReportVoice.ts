import { generateSummary } from './generateSummary';
import { textToSpeech } from './textToSpeech';
import { writeFile } from 'fs/promises';

async function main() {
  const markdown = await import('fs/promises').then(f => f.readFile('MORA-report.md', 'utf8'));

  const summary = await generateSummary(markdown);
  console.log('\n📝 MORA Summary Preview:\n', summary);

  const audioBuffer = await textToSpeech(summary);
  const outputFile = `MORA-summary-${Date.now()}.mp3`;
  await writeFile(outputFile, audioBuffer);

  console.log(`✅ Audio saved as: ${outputFile}`);
}

main().catch(err => {
  console.error('❌ Failed to generate voice:', err);
  process.exit(1);
});
