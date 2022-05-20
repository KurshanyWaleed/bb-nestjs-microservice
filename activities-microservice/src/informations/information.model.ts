import mongoose from 'mongoose';

export const InforamtionSchema = new mongoose.Schema(
  {
    title: { type: String, unique: true },
    section: { type: String },
    content: { type: String },
    media: { type: String, default: '' },
    liked: { type: Number, default: 0 },
  },

  { timestamps: true },
);
export class Information {
  _id: string;
  title: string;
  section: string;
  content: string;
  media: string;
  liked: string;
}
