import { FORUM_MS_PORT, USER_MS_PORT } from './constantes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: FORUM_MS_PORT,
      },
    },
  );
  app
    .listen()
    .then(() =>
      console.log('FORUM MS is listening on port : ' + FORUM_MS_PORT),
    );
}
bootstrap();
