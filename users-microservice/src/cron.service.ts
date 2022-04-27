import { Cron } from '@nestjs/schedule';
import { UsersService } from './app.users.service';
import { ESPACE } from './utils/constantes';
export class CronService {
  constructor(private readonly userService: UsersService) {}

  @Cron('0 0 * * *')
  async mondayCron() {
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
}
