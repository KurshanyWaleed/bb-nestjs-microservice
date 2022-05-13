import * as mongoose from 'mongoose';
export const AFTER_BORN_ACTIVITIES_SCHEMA = new mongoose.Schema(
  {
    title: { type: String, required: true },
    activities: {
      type: [
        {
          title: String,
          description: String,
          media: String,
          neededAge: [Number],
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
    neededAge: { type: [Number] },
  },

  { timestamps: true },
);
export const BEFORE_BORN_ACTIVITIES_SCHEMA = new mongoose.Schema(
  {
    title: { type: String, required: true },
    activities: {
      type: [
        {
          title: String,
          description: String,
          media: String,
          neededAge: [Number],
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
  title: string;
  activities: [string];
}
export class BeforeBorn {
  _id: string;
  title: string;
  activities: [string];
}
export class WeekDTO {
  title: string;
  activities: [{ title: string; description: string; media: string }];
  media: string;
}
export class Activity {
  title: string;
  description: string;
  media: string;
  neededAge: [Number];
}
export class CreateActivityDTO {
  title: string;
  description: string;
  media: string;
  neededAge: [Number];
}
