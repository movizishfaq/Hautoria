import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

declare global {
  // eslint-disable-next-line no-var
  var __hautoriaMongoPromise: Promise<typeof mongoose> | undefined;
  // eslint-disable-next-line no-var
  var __hautoriaMongoLastError: string | undefined;
}

/**
 * Serverless-safe Mongo connection.
 * Reuses the cached promise across warm Vercel invocations.
 */
export async function connectDb(): Promise<boolean> {
  mongoose.set('strictQuery', true);

  if (process.env.VERCEL && !process.env.MONGODB_URI) {
    global.__hautoriaMongoLastError = 'MONGODB_URI is missing in Vercel environment variables';
    logger.error(global.__hautoriaMongoLastError);
    return false;
  }

  const readyState = mongoose.connection.readyState;
  // 1 = connected, 2 = connecting
  if (readyState === 1) return true;
  if (readyState === 2 && global.__hautoriaMongoPromise) {
    try {
      await global.__hautoriaMongoPromise;
      return mongoose.connection.readyState === 1;
    } catch {
      global.__hautoriaMongoPromise = undefined;
    }
  }

  try {
    if (!global.__hautoriaMongoPromise) {
      global.__hautoriaMongoPromise = mongoose.connect(env.mongoUri, {
        // Local Windows TLS quirks only — production Atlas must use valid certs
        tlsAllowInvalidCertificates: env.nodeEnv !== 'production' && !process.env.VERCEL,
        serverSelectionTimeoutMS: 15000,
        maxPoolSize: process.env.VERCEL ? 5 : 10,
        bufferCommands: true,
        // Vercel → Atlas often breaks on IPv6 DNS; force IPv4
        family: 4,
      });
    }
    await global.__hautoriaMongoPromise;
    global.__hautoriaMongoLastError = undefined;
    logger.info('MongoDB connected');
    return mongoose.connection.readyState === 1;
  } catch (error) {
    global.__hautoriaMongoPromise = undefined;
    const message = error instanceof Error ? error.message : String(error);
    global.__hautoriaMongoLastError = message;
    if (message.includes('whitelist') || message.includes('IP')) {
      logger.error(
        'MongoDB Atlas blocked this IP. In Atlas → Network Access → Allow Access from Anywhere (0.0.0.0/0) for Vercel.'
      );
    } else if (message.includes('certificate') || message.includes('TLS')) {
      logger.error('MongoDB TLS failed. Check Atlas connection string / network.');
    }
    logger.error(`MongoDB connection failed: ${message}`);
    return false;
  }
}

export function isDbReady() {
  return mongoose.connection.readyState === 1;
}

export function getLastMongoError() {
  return global.__hautoriaMongoLastError;
}
