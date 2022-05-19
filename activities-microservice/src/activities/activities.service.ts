import { level, Situation } from './enum';
import { CronService } from './cron.service';
import { USERS } from './../constantes';
import { ClientProxy } from '@nestjs/microservices/client';
import { situation } from 'enum';
import { Model } from 'mongoose';
/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AfterBorn,
  BeforeBorn,
  CreateActivityDTO,
  WeekActivitiesDto,
  WeekDTO,
} from './model';
import { ESPACE } from 'src/constantes';

@Injectable()
export class ActivitiesService {
  constructor(
    @Inject(USERS) private readonly userservice: ClientProxy,
    private readonly cron: CronService,
    @InjectModel(BeforeBorn.name)
    private readonly ActivityBBModel: Model<BeforeBorn>,
    @InjectModel(AfterBorn.name)
    private readonly ActivityABModel: Model<AfterBorn>,
  ) {
    this.cron.createNewCrone('test');
  }

  async createActivityService(weeks: WeekDTO, type: string) {
    try {
      switch (type) {
        case '2':
          if ((await this.ActivityABModel.find()).length == 0) {
            for (var i = 1; i <= 96; i++) {
              weeks.week = `Week ${i} Activities`;
              var acts = [...weeks.activities];
              acts[0].title = `The first Activity for week ${i} : Lorum ipserum antom cherum`;
              acts[1].title = `The second Activity for week ${i} : Lorum ipserum cherum antom`;
              acts[2].title = `The Theard Activity for week ${i} : Lorum ipserum ant `;

              console.log(acts);
              await new this.ActivityABModel({
                week: weeks.week,
                activities: [...acts],
                media: '',
              }).save();
            }
            return { success: true };
          } else {
            return { message: 'full' };
          }

        case '1':
          if ((await this.ActivityBBModel.find()).length == 0) {
            for (var i = 1; i <= 36; i++) {
              weeks.week = `Week ${i} Activities`;
              var acts = [...weeks.activities];
              acts[0].title = `The first Activity for week ${i} : Lorum ipserum antom cherum`;
              acts[1].title = `The second Activity for week ${i} : Lorum ipserum cherum antom`;
              acts[2].title = `The Theard Activity for week ${i} : Lorum ipserum ant `;

              console.log(acts);
              await new this.ActivityBBModel({
                week: weeks.week,
                activities: [...acts],
                media: '',
              }).save();
            }
            return { success: true };
          } else {
            return { message: 'full' };
          }
      }
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async getActivitiesService(sit: situation, babyAge: number) {
    if (sit == situation.EXPECTANT_NEW_BABY) {
      const data = (await this.ActivityBBModel.find({})).filter(
        (weeks) => Number(weeks.week.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
      const act = {
        week: data.week,
        activities: data.activities
          .filter((actv) => actv.level == 'EASY')
          .slice(0, 3),
      };
      return act;

      //
      //
      //
      //
      //
    } else if (sit == situation.PARENT) {
      const data = (await this.ActivityABModel.find({})).filter(
        (weeks) => Number(weeks.week.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
      const act = {
        week: data.week,
        activities: data.activities
          .filter((actv) => actv.level == 'EASY')
          .slice(0, 3),
      };

      return act;
    } else if (sit == situation.PARENT_AND_EXPECTANT_NEW_BABY) {
      const data = (await this.ActivityBBModel.find({})).filter(
        (weeks) => Number(weeks.week.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
      const act = {
        week: data.week,
        activities: data.activities.filter((actv) => actv.level == 'EASY'),
      };

      return act;
    }
  }
  async handelIncomminData(payload: WeekActivitiesDto) {
    switch (payload.user_situation) {
      case Situation.EXPECTANT_NEW_BABY:
        return (await this.ActivityBBModel.find()).filter(
          (weeks) =>
            Number(weeks.week.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );
      case Situation.PARENT_AND_EXPECTANT_NEW_BABY:
        return (await this.ActivityBBModel.find()).filter(
          (weeks) =>
            Number(weeks.week.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );
      case Situation.PARENT:
        const data = (await this.ActivityABModel.find()).filter(
          (weeks) =>
            Number(weeks.week.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );

        return data;
    }
  }

  async onCreateActivityService(activity: CreateActivityDTO) {
    try {
      console.log({ activity });
      if (activity.isBorn) {
        const { title, description, media, level } = activity;
        activity.week.map(async (date) => {
          await this.ActivityABModel.updateOne(
            { week: 'Week ' + date + ' Activities' },
            {
              $push: {
                activities: { title, description, media, level },
              },
            },
          );
        });

        return { message: 'the new Activitie has been added sucsessfuly' };
      } else {
        const { title, description, media, level } = activity;
        activity.week.map(async (date) => {
          await this.ActivityBBModel.updateOne(
            { week: 'Week ' + date + ' Activities' },
            {
              $push: {
                activities: { title, description, media, level },
              },
            },
          );
        });

        return { message: 'the new Activitie has been added sucsessfuly' };
      }
    } catch (e) {
      return new BadRequestException(e);
    }
  }

  async onUpdateActivityService(attributes: any) {
    return { message: attributes };
  }
}
