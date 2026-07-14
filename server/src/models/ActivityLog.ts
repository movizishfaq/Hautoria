import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  userId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: { type: String, index: true },
    action: { type: String, required: true, index: true },
    entity: { type: String, required: true },
    entityId: String,
    metadata: Schema.Types.Mixed,
    ip: String,
    userAgent: String,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model<IActivityLog>('ActivityLog', activityLogSchema);
