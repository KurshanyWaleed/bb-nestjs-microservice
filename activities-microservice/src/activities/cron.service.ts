/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, Logger } from '@nestjs/common';
import {
  Cron,
  CronExpression,
  Interval,
  SchedulerRegistry,
} from '@nestjs/schedule';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly schedule: SchedulerRegistry) {}
  sendWeeklyActiviites() {
    //this.schedule.addCronJob()
  }
  //@Cron('5 * * * * *')
  //   @Cron(CronExpression.EVERY_SECOND)
  //   sendWeeklyActivities() {
  //     this.logger.debug('something will happen here ! ');
  //     // this.userservice.emit(ACTIVITIES_OF_WEEK, {});
  //   }
  //   @Interval('notifications', 1000)
  //   handleInterval() {
  //     this.logger.debug('something will happen here from interval! ');
  //   }
}
