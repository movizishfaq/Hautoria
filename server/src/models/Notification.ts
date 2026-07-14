import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  userId: string;
  title: string;
  body: string;
  kind: 'order' | 'reward' | 'system' | 'promo';
  read: boolean;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: String, required: true, index: true },
    title: String,
    body: String,
    kind: { type: String, enum: ['order', 'reward', 'system', 'promo'], default: 'system' },
    read: { type: Boolean, default: false, index: true },
    metadata: Schema.Types.Mixed,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
