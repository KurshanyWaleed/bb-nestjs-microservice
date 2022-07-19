import { level, rating } from 'src/utils/enum';

export class Activity {
  _id: string;
  title: string;
  description: string;
  media: string;
  level: level;
  rating: rating;
  reaction: string;
  isDone: boolean;
}

export class UsersActivities {
  _id: string;
  week: string;
  activities: Activity[];
}
export class CreateActivityDTO {
  title: string;
  description: string;
  media: string;
  isBorn: boolean;
  week: [number];
}
