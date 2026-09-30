import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function mergeFiles() {
  try {
    const arrayData = JSON.parse(await fs.readFile(path.join(__dirname, 'challenges_array.json'), 'utf-8'));
    const stringStackData = JSON.parse(await fs.readFile(path.join(__dirname, 'challenges_string_stack.json'), 'utf-8'));
    const queueMixedData = JSON.parse(await fs.readFile(path.join(__dirname, 'challenges_queue_mixed.json'), 'utf-8'));

    const allChallenges = [...arrayData, ...stringStackData, ...queueMixedData];

    console.log(`Array challenges: ${arrayData.length}`);
    console.log(`String+Stack challenges: ${stringStackData.length}`);
    console.log(`Queue+Mixed challenges: ${queueMixedData.length}`);
    console.log(`Total challenges: ${allChallenges.length}`);

    await fs.writeFile(
      path.join(__dirname, 'challenges.json'),
      JSON.stringify(allChallenges, null, 2),
      'utf-8'
    );

    console.log('Successfully merged into challenges.json');
  } catch (error) {
    console.error('Error merging:', error.message);
    process.exit(1);
  }
}

mergeFiles();
