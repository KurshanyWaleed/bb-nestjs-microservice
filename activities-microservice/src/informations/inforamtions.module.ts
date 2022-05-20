import { InformationService } from './information.service';
import { InforamtionSchema, Information } from './information.model';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InformationsController } from './informations.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_CONNXION'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: Information.name, schema: InforamtionSchema },
    ]),
  ],

  controllers: [InformationsController],
  providers: [InformationService],
})
export class InforamtionsModule {}
