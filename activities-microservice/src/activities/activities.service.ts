import { Situation } from './enum';
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

  async createActivityService(week: WeekDTO, type: string) {
    try {
      switch (type) {
        case '2':
          if ((await this.ActivityABModel.find()).length == 0) {
            for (var i = 1; i <= 96; i++) {
              week.title = `Week ${i} Activities`;
              var acts = [...week.activities];
              acts[0].title = `The first Activity for week ${i} : Lorum ipserum antom cherum`;
              acts[1].title = `The second Activity for week ${i} : Lorum ipserum cherum antom`;
              acts[2].title = `The Theard Activity for week ${i} : Lorum ipserum ant `;

              console.log(acts);
              await new this.ActivityABModel({
                title: week.title,
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
              week.title = `Week ${i} Activities`;
              var acts = [...week.activities];
              acts[0].title = `The first Activity for week ${i} : Lorum ipserum antom cherum`;
              acts[1].title = `The second Activity for week ${i} : Lorum ipserum cherum antom`;
              acts[2].title = `The Theard Activity for week ${i} : Lorum ipserum ant `;

              console.log(acts);
              await new this.ActivityBBModel({
                title: week.title,
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
      console.log(
        'passed here' +
          sit +
          (await this.ActivityBBModel.find({})).filter(
            (week) =>
              Number(week.title.split(ESPACE)[1]) >= Number(babyAge / 7),
          )[0],
      );
      return (await this.ActivityBBModel.find({})).filter(
        (week) => Number(week.title.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
    } else if (sit == situation.PERENT) {
      return (await this.ActivityABModel.find({})).filter(
        (week) => Number(week.title.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
    } else if (sit == situation.PARENT_AND_EXPECTANT_NEW_BABY) {
      return (await this.ActivityBBModel.find({})).filter(
        (week) => Number(week.title.split(ESPACE)[1]) >= Number(babyAge / 7),
      )[0];
    }
  }
  async handelIncomminData(payload: WeekActivitiesDto) {
    switch (payload.user_situation) {
      case Situation.EXPECTANT_NEW_BABY:
        return (await this.ActivityBBModel.find()).filter(
          (week) =>
            Number(week.title.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );
      case Situation.PARENT_AND_EXPECTANT_NEW_BABY:
        return (await this.ActivityBBModel.find()).filter(
          (week) =>
            Number(week.title.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );
      case Situation.PERENT:
        return (await this.ActivityABModel.find()).filter(
          (week) =>
            Number(week.title.split(ESPACE)[1]) ==
            Number(payload.last_week_activities) + 1,
        );
    }
  }

  async adminCreateActivityService(body: CreateActivityDTO) {}
}
