import { UsersService } from 'src/app.users.service';
import { CronService } from './cron.service';
import { USER_MS_PORT, ESPACE } from './utils/constantes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './app.users.module';
import * as admin from 'firebase-admin';
var serviceAccount = require('./utils/bbrains-firebase-adminsdk-uocdn-9bcdbf9ed1.json');
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.TCP,
      options: {
        port: USER_MS_PORT,
      },
    },
  );
  app
    .listen()
    .then(() => console.log('USERS MS is listening on port : ' + USER_MS_PORT));

  // Initialize the firebase admin app
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

bootstrap();
