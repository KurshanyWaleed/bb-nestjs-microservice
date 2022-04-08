import { ActivitiesService } from './activities.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Param, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { situation } from 'enum';
import { GET_USER_ACITIVITES } from '../constantes';
import { ActivityDTO } from './model';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activityService: ActivitiesService) {}
  @Post('add-New-Activity/:type')
  createActivity(@Body() body: ActivityDTO, @Param('type') type: string) {
    return this.activityService.createActivityService(body, type);
  }
  @MessagePattern(GET_USER_ACITIVITES)
  async getActivities(data: { situation: situation; babyAge: number }) {
    console.log(data);

    return await this.activityService.getActivitiesService(
      data.situation,
      data.babyAge,
    );
  }
}
