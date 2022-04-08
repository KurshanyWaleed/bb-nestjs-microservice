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
