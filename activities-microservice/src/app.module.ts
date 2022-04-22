import { CronService } from './activities/cron.service';
import { ActivitiesModule } from './activities/activities.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS, USERS_MS_PORT } from './constantes';

@Module({
  imports: [
    ActivitiesModule,
    ClientsModule.register([
      {
        name: USERS,
        transport: Transport.TCP,
        options: { port: USERS_MS_PORT },
      },
    ]),
  ],
  controllers: [],
  providers: [CronService],
})
export class AppModule {}
