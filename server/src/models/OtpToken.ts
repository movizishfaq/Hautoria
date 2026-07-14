import mongoose, { Schema, Document } from 'mongoose';

export interface IOtpToken extends Document {
  email?: string;
  phone?: string;
  code: string;
  purpose: 'verify_email' | 'verify_phone' | 'reset_password';
  expiresAt: Date;
  used: boolean;
}

const otpSchema = new Schema<IOtpToken>({
  email: { type: String, index: true },
  phone: { type: String, index: true },
  code: { type: String, required: true },
  purpose: {
    type: String,
    enum: ['verify_email', 'verify_phone', 'reset_password'],
    required: true,
  },
  expiresAt: { type: Date, required: true, index: true },
  used: { type: Boolean, default: false },
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const OtpToken = mongoose.model<IOtpToken>('OtpToken', otpSchema);
