import { ESPACE } from './../constantes';
/*
https://docs.nestjs.com/providers#services
*/

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ACTIVITIES_OF_WEEK, USERS } from 'src/constantes';
@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(
    @Inject(USERS) private readonly userservice: ClientProxy,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  // todo : create Cron
  createNewCrone(cronName: string, payload?: any): CronJob {
    const job = new CronJob(CronExpression.EVERY_5_SECONDS, () => {
      this.logger.debug(`${cronName} is runnig ${Date().split(ESPACE)[0]}`);
      if (Date().split(ESPACE)[0] == 'Mon') {
        //  this.userservice.emit;
      }
      this.userservice.emit(ACTIVITIES_OF_WEEK, payload);
    });
  }
  startCron(cronName: string, job: CronJob) {
    this.schedulerRegistry.addCronJob(cronName, job);
    job.start();
    this.logger.debug(`${cronName} has been started`);
  }
  // todo : stop Cron
  stopCronJob(cronName: string) {
    const job = this.schedulerRegistry.getCronJob(cronName);
    job.stop();
    this.logger.debug(`${cronName} has been killed`);
  }
  sendWeeklyActiviites() {}
}
