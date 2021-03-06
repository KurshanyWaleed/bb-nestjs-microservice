import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from './app.users.service';
import { ESPACE } from './utils/constantes';
@Injectable()
export class CronService {
  constructor(private readonly userService: UsersService) {}
  //Crone every Day

  //@Cron('35 * * * * *')
  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async dayCron() {
    console.log(Date().split(ESPACE)[0]);
    switch (Date().split(ESPACE)[0]) {
      case 'Mon':
        return await this.userService.activitiesOfWeekService('Mon');
      case 'The':
        return await this.userService.activitiesOfWeekService('The');
      case 'Wed':
        return await this.userService.activitiesOfWeekService('Wed');
      case 'Thu':
        return await this.userService.activitiesOfWeekService('Thu');
      case 'Fri':
        return await this.userService.activitiesOfWeekService('Fri');
      case 'Sat':
        return await this.userService.activitiesOfWeekService('Sat');
      case 'San':
        return await this.userService.activitiesOfWeekService('San');
    }
  }
  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async ddayCron() {
  //   console.log(Date().split(ESPACE)[0]);
  // }
}
