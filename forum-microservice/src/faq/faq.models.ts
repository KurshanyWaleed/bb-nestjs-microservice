import mongoose from 'mongoose';

export const QuestionSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, unique: true },
    answer: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
    requested: { type: Boolean },
    media: { type: String },
    editedBy: { type: mongoose.Schema.Types.ObjectId, default: null },
  },
  { timestamps: true },
);
export class Question {
  _id: string;
  content: string;
  answer: string;
  requested: string;
  addedBy: string;
  media: string;
  editedBy: string;
}
