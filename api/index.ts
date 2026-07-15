import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';

let dbReady: Promise<boolean> | null = null;

async function ensureDb() {
  if (!dbReady) dbReady = connectDb();
  return dbReady;
}

/**
 * Single Vercel Serverless Function for the full Express API.
 * Rewrites send `/api/*` here while preserving routing via dual mounts in app.ts.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  await ensureDb();
  // Express Request/Response are compatible with Vercel's Node request objects
  return app(req as never, res as never);
}
