import { USER_MS_PORT, ESPACE } from './utils/constantes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './app.users.module';
import { Logger } from '@nestjs/common';

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

  console.log(Date().split(ESPACE)[4] == '14:30:08');
  if (Date().split(ESPACE)[4] == '14:30:08') {
    console.log('its working');
  }
}

bootstrap();
