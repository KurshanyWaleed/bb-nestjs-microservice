import { Activity, UsersActivities } from './acitivites.model';
import { Situation, BabyGender, UserType, privilege } from './../utils/enum';
import mongoose from 'mongoose';
export class Token {
  userName: string;
  _id: string;
  role: string;
  iat: string;
  exp: string;
}

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

export const UserSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    babyAge: { type: Number, required: true },
    situation: { type: String, required: true, enum: Situation },
    babyGender: { type: String, required: true, enum: BabyGender },
    location: { type: String, required: true },
    password: { type: String, required: true },
    verified: { type: Boolean, default: false },
    photoProfile: { type: String, required: false, default: '' },
    ableToChangePassword: { type: Boolean, default: false },
    role: { type: String, default: UserType.MEMBER, enum: UserType },
    memberIn: { type: [mongoose.Schema.Types.ObjectId], ref: 'group' },
    usersActivities: {
      type: [{ title: String, activities: [ActivitySchema] }],
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

  babyGender: BabyGender;

  email: string;

  location: string;

  password: string;

  verified: Boolean;

  photoProfile: String;

  memberIn: string[];

  role: UserType;
  usersActivities: UsersActivities[];

  ableToChangePassword: Boolean;
}
export const AdministrationSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    profileImage: { type: String, required: false, default: '' },
    password: { type: String, required: true },
    privilege: { type: String, default: privilege.ADMIN, enum: privilege },
  },
  { timestamps: true },
);
export class Administration {
  _id: string;
  password: string;
  userName: string;
  profileImage: string;
  privilege: privilege;
}
