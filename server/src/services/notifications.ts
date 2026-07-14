import { Notification } from '../models/Notification.js';

export async function createNotification(input: {
  userId: string;
  title: string;
  body: string;
  kind?: 'order' | 'reward' | 'system' | 'promo';
  metadata?: Record<string, unknown>;
}) {
  return Notification.create({
    userId: input.userId,
    title: input.title,
    body: input.body,
    kind: input.kind ?? 'system',
    metadata: input.metadata,
  });
}
