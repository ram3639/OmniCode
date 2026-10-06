import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../server/.env') });

const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(async () => {
  const Challenge = mongoose.connection.collection('challenges');
  const pal = await Challenge.findOne({ title: /Palindrome/i });
  if (pal) {
    console.log(pal.title);
    console.log("Visible:", JSON.stringify(pal.testCases, null, 2));
    console.log("Hidden:", JSON.stringify(pal.hiddenTestCases, null, 2));
  } else {
    console.log('Not found');
  }
  process.exit(0);
}).catch(console.error);
