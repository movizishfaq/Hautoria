import { ActivityLog } from '../models/ActivityLog.js';

export async function logActivity(input: {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}) {
  await ActivityLog.create(input);
}
