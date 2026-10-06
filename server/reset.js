import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../server/.env') });

const uri = process.env.MONGO_URI;

mongoose.connect(uri).then(async () => {
  console.log('Connected.');
  
  // 1. Delete all submissions
  const subRes = await mongoose.connection.collection('submissions').deleteMany({});
  console.log('Deleted submissions:', subRes.deletedCount);
  
  // 2. Delete all progress records
  const progRes = await mongoose.connection.collection('progresses').deleteMany({});
  console.log('Deleted progress records:', progRes.deletedCount);
  
  // 3. Clear solvedChallenges in Users
  const userRes = await mongoose.connection.collection('users').updateMany({}, { $set: { solvedChallenges: [] } });
  console.log('Reset user solvedChallenges:', userRes.modifiedCount);
  
  // 4. Reset challenge stats
  const chalRes = await mongoose.connection.collection('challenges').updateMany({}, { $set: { totalSubmissions: 0, acceptedSubmissions: 0 } });
  console.log('Reset challenge stats:', chalRes.modifiedCount);

  console.log('Done.');
  process.exit(0);
}).catch(console.error);
