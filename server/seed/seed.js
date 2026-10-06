import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../src/models/User.js';
import Challenge from '../src/models/Challenge.js';
import Submission from '../src/models/Submission.js';
import Progress from '../src/models/Progress.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/omnicode');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();

    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database is already seeded (found existing users). Skipping seed script to prevent data loss.');
      console.log('If you want to force a reset, you must manually clear the database first.');
      process.exit(0);
    }

    console.log('Clearing database...');
    await User.deleteMany({});
    await Challenge.deleteMany({});
    await Submission.deleteMany({});
    await Progress.deleteMany({});
    
    // Some collections like Telemetry aren't actually defined as models but rather derived, 
    // but just in case, we can drop the db or just stick to deleting known models.
    try {
        await mongoose.connection.db.collection('telemetries').drop();
    } catch (e) { }

    console.log('Seeding Challenges...');
    const challengesPath = path.join(__dirname, 'challenges.json');
    const challengesData = JSON.parse(await fs.readFile(challengesPath, 'utf-8'));
    await Challenge.insertMany(challengesData);

    console.log('Creating Admin User...');
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@omnicode.com',
      password: 'admin123',
      role: 'admin',
      provider: 'local'
    });

    console.log('Creating Student User...');
    const studentUser = await User.create({
      username: 'student',
      email: 'student@omnicode.com',
      password: 'student123',
      role: 'student',
      provider: 'local'
    });

    console.log('--- Seeding Summary ---');
    console.log(`Challenges: ${challengesData.length}`);
    console.log(`Users Created: 2 (Admin: ${adminUser.email}, Student: ${studentUser.email})`);
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
