import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri);
    logger.info('MongoDB connected');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('whitelist') || message.includes('IP')) {
      logger.error(
        'MongoDB Atlas blocked this IP. In Atlas → Network Access → Add IP Address → "Add Current IP" (or 0.0.0.0/0 for dev only).'
      );
    }
    throw error;
  }
}
