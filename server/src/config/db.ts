import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

export async function connectDb() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.mongoUri, {
      // Windows / corporate TLS proxies can break Atlas leaf verification in Node 24
      tlsAllowInvalidCertificates: env.nodeEnv !== 'production',
      serverSelectionTimeoutMS: 12000,
    });
    logger.info('MongoDB connected');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes('whitelist') || message.includes('IP')) {
      logger.error(
        'MongoDB Atlas blocked this IP. In Atlas → Network Access → Add IP Address → "Add Current IP" (or 0.0.0.0/0 for dev only).'
      );
    } else if (message.includes('certificate') || message.includes('TLS')) {
      logger.error(
        'MongoDB TLS failed. Check Atlas connection string / network. App will keep running with local-order fallback on the frontend.'
      );
    }
    logger.error(`MongoDB connection failed: ${message}`);
    return false;
  }
}
