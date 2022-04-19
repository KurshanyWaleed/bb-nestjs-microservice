import { Reply } from './reply.model';
import { BabyGender, UserType } from 'src/enum';
import { Post } from './post.model';

export class Activity {
  title: string;
  description: String;
  media: string;
  _id: string;
  isComplited: boolean;
  isDone: boolean;
}
export class UsersActivities {
  _id: string;
  title: string;
  activities: Activity[];
}
export class User {
  _id: string;

  userName: string;

  situation: string;

  type: string;

  babyAge: number;

  babyGender: BabyGender;

  email: string;

  location: string;

  password: string;

  verified: Boolean;

  photoProfile: String;

  role: UserType;
  usersActivities: UsersActivities[];

  ableToChangePassword: Boolean;
  posts: [Post];
  replies: [Reply];
}
