import { ACTIVITIES_MS_PORT, ACTIVITIES_SERVER } from './constantes';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { port: ACTIVITIES_MS_PORT },
  });

  await app.startAllMicroservices();
  await app
    .listen(ACTIVITIES_SERVER)
    .then(() =>
      console.log(
        `Server's URL : http://localhost:${ACTIVITIES_SERVER} \nACTIVITIES Microservice is listening on port:${ACTIVITIES_MS_PORT}`,
      ),
    );
}
bootstrap();
