import {
  CREATE_ACTIVITIES,
  GET_ACTIVITIES_OF_WEEK,
  NEW_ACTIVITY,
  POST_FEEDBACK,
  UPDATE_ACTIVITY,
} from './../constantes';
import { CronService } from './cron.service';
import { ActivitiesService } from './activities.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Param, Post, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { situation } from 'enum';
import { GET_USER_ACITIVITES } from '../constantes';
import { CreateActivityDTO, WeekActivitiesDto, WeekDTO } from './model';

@Controller('activities')
export class ActivitiesController {
  private readonly logger = new Logger(ActivitiesController.name);

  constructor(
    private readonly activityService: ActivitiesService,
    private readonly cron: CronService,
  ) {}
  @Post('add-New-Activity/:type')
  createActivity(@Body() body: WeekDTO, @Param('type') type: string) {
    return this.activityService.createActivityService(body, type);
  }
  @MessagePattern(NEW_ACTIVITY)
  adminCreateActivity(payload: CreateActivityDTO) {
    console.log('from activities:' + payload);
    return this.activityService.onCreateActivityService(payload);
  }
  //!---------------------------------------------------------------------
  @MessagePattern(UPDATE_ACTIVITY)
  adminUpdateActivity(payload: { attributes: any; _id: string }) {
    console.log('from activities:' + payload);
    return this.activityService.onUpdateActivityService(payload);
  }

  //!---------------------------------------------------------------------
  @MessagePattern(GET_USER_ACITIVITES)
  async getActivities(data: { situation: situation; babyAge: number }) {
    return await this.activityService.getActivitiesService(
      data.situation,
      data.babyAge,
    );
  }
  @MessagePattern(GET_ACTIVITIES_OF_WEEK)
  getdata(payload: WeekActivitiesDto) {
    this.logger.debug(payload.last_week_activities);
    const newPayload = this.activityService.handelIncomminData(payload);
    return newPayload;
  }

  @MessagePattern(POST_FEEDBACK)
  postFeedBack(feed: any) {
    console.log(feed);
  }
}
