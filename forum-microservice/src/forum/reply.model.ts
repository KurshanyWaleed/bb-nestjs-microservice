import mongoose from 'mongoose';
import { Post } from './post.model';
import { User } from './user.model';
export const replySchema = new mongoose.Schema(
  {
    content: { type: String },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true },
);
export class Reply {
  content: string;
  from: User;
  post: Post;
}
