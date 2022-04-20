import { CronService } from './activities/cron.service';
import { ActivitiesModule } from './activities/activities.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ActivitiesModule],
  controllers: [],
  providers: [CronService],
})
export class AppModule {}
