import mongoose from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';

export const ActivitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    isComplited: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },
    media: { type: String },
  },
  { timestamps: true },
);

export const groupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    discription: { type: String, default: '' },
    media: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    postes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Post' },

    members: {
      type: [mongoose.Schema.Types.ObjectId],
      unique: false,
      ref: 'user',
    },
  },
  { timestamps: true },
);

export class Group {
  title: string;
  discription: string;
  media: string;
  coverPhoto: string;
  members: [User];
  posts: [Post];
}
