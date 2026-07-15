import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import app from '../server/src/app.js';
import { connectDb } from '../server/src/config/db.js';
import { ensureCatalogSeeded } from '../server/src/services/ensureCatalog.js';

/**
 * Single Vercel Serverless Function for the full Express API.
 * Always reconnects if the cached Mongo connection dropped.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const connected = await connectDb();
    if (connected) {
      await ensureCatalogSeeded().catch((err) => {
        console.error('ensureCatalogSeeded failed', err);
      });
    } else {
      console.error(
        'MongoDB unavailable. Set MONGODB_URI in Vercel → Settings → Environment Variables, and allow 0.0.0.0/0 in Atlas Network Access.'
      );
    }

    // Express may return a Promise depending on async middleware
    await Promise.resolve(app(req as never, res as never));
  } catch (err) {
    console.error('API handler failure', err);
    if (!res.headersSent) {
      res.status(500).json({
        error: err instanceof Error ? err.message : 'Internal server error',
        code: 'HANDLER_FAILURE',
        mongo: mongoose.connection.readyState,
      });
    }
  }
}
