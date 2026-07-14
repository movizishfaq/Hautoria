import mongoose, { Schema, Document } from 'mongoose';

export interface ISupportTicket extends Document {
  userId?: string;
  email: string;
  subject: string;
  message: string;
  orderId?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high';
  channel: 'chat' | 'email' | 'whatsapp' | 'ticket';
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ISupportTicket>(
  {
    userId: { type: String, index: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    orderId: String,
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high'],
      default: 'normal',
    },
    channel: {
      type: String,
      enum: ['chat', 'email', 'whatsapp', 'ticket'],
      default: 'ticket',
    },
    attachments: [String],
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', ticketSchema);
