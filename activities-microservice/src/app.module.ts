import { InforamtionsModule } from './informations/inforamtions.module';
import { ActivitiesModule } from './activities/activities.module';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS, USERS_MS_PORT } from './constantes';

@Module({
  imports: [
    InforamtionsModule,
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
  providers: [],
})
export class AppModule {}
