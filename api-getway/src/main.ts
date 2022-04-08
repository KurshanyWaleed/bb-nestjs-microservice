import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { API_GATEWAY_PORT_SERVER } from './utils/constantes';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setViewEngine('hbs');
  app.setGlobalPrefix('api-gateway');
  await app
    .listen(API_GATEWAY_PORT_SERVER)
    .then(() => console.log('Api Gateway : localhost:3000'));
}
bootstrap();
