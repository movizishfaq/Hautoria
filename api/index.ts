import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';
import { ensureCatalogSeeded } from '../server/src/services/ensureCatalog.js';

let ready: Promise<void> | null = null;

async function bootstrap() {
  const connected = await connectDb();
  if (connected) await ensureCatalogSeeded();
}

/**
 * Single Vercel Serverless Function for the full Express API.
 * Rewrites send `/api/*` here while preserving routing via dual mounts in app.ts.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!ready) ready = bootstrap();
  await ready;
  return app(req as never, res as never);
}
