import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  productId: string;
  userId: string;
  author: string;
  rating: number;
  text: string;
  images: string[];
  videos: string[];
  helpfulVotes: number;
  reported: boolean;
  verified: boolean;
  createdAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    author: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    text: { type: String, required: true, maxlength: 2000 },
    images: [String],
    videos: [String],
    helpfulVotes: { type: Number, default: 0 },
    reported: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ productId: 1, createdAt: -1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
