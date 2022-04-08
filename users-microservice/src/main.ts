import { USER_MS_PORT } from './utils/constantes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UsersModule } from './app.users.module';

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
}

bootstrap();
