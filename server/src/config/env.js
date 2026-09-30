import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'JUDGE0_API_URL',
  'GEMINI_API_KEY',
  'MICROSERVICE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Error: Environment variable ${envVar} is missing.`);
    process.exit(1);
  }
}

export const env = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JUDGE0_API_URL: process.env.JUDGE0_API_URL,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  MICROSERVICE_URL: process.env.MICROSERVICE_URL,
  PORT: process.env.PORT || 5000,
};
