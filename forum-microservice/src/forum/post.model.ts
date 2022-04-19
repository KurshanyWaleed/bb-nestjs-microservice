import mongoose from 'mongoose';
import { Group } from './group.model';
import { Reply } from './reply.model';
import { User } from './user.model';

export class Post {
  from: User;
  group: Group;
  content: string;
  media: string;
  replies: [Reply];
}
export const postSchema = new mongoose.Schema(
  {
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    content: { type: String },
    media: { type: String },
    replies: { type: [mongoose.Schema.Types.ObjectId], ref: 'Reply' },
  },
  { timestamps: true },
);
