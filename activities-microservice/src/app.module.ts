import { ActivitiesModule } from './activities/activities.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [ActivitiesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}