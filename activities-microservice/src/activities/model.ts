import * as mongoose from 'mongoose';
import { level } from './enum';
export const AFTER_BORN_ACTIVITIES_SCHEMA = new mongoose.Schema(
  {
    week: { type: String },
    activities: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          media: { type: String },
          level: { type: String, enuml: level, default: level.EASY },
          isDone: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true },
);
export const ACTIVITIES_SCHEMA = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String },
    media: { type: String },
    level: { type: String, enuml: level, default: level.EASY },
    isDone: { type: Boolean, default: false },
  },

  { timestamps: true },
);
export const BEFORE_BORN_ACTIVITIES_SCHEMA = new mongoose.Schema(
  {
    week: { type: String },
    activities: {
      type: [
        {
          title: { type: String },
          description: { type: String },
          media: { type: String },
          level: { type: String, enuml: level, default: level.EASY },
          isDone: { type: Boolean, default: false },
        },
      ],
    },
  },
  { timestamps: true },
);
export class WeekActivitiesDto {
  last_week_activities: string;
  user_situation: string;
}

export class AfterBorn {
  _id: string;
  week: string;
  activities: [Activity];
}
export class BeforeBorn {
  _id: string;
  week: string;
  activities: [Activity];
}
export class WeekDTO {
  week: string;
  activities: [
    {
      title: string;
      description: string;
      media: string;
      level: level;
      isDone: boolean;
    },
  ];
  media: string;
}
export class Activity {
  _id: string;
  title: string;
  description: string;
  media: string;
  level: level;
  isDone: boolean;
}
export class CreateActivityDTO {
  title: string;
  description: string;
  media: string;
  week: [number];
  isBorn: boolean;
  level: string;
  isDone: boolean;
}
