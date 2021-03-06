import mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    babyAge: { type: Number, required: true },
    location: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    photoProfile: { type: String, required: false, default: '' },
    ableToChangePassword: { type: Boolean, default: false },
    usersActivities: {
      // ref: "Activities",
    },
  },
  { timestamps: true },
);

export class User {
  _id: string;

  userName: string;

  situation: string;

  type: string;

  babyAge: number;

  email: string;

  location: string;

  password: string;

  verified: Boolean;

  photoProfile: String;

  ableToChangePassword: Boolean;
}
export class Activity {
  _id: string;
  title: string;
  description: String;
  media: string;
  isComplited: boolean;
  level: string;
}
export class CreateActivityDTO {
  title: string;
  description: string;
  media: string;
  week: [number];
  level: string;
  isBorn: boolean;
  isDone: boolean;
}
export class updateActivityDto {}
