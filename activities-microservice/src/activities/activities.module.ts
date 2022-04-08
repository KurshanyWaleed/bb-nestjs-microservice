import { ActivitiesService } from './activities.service';
import { ActivitiesController } from './activities.controller';

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import {
  AfterBorn,
  AFTER_BORN_ACTIVITIES_SCHEMA,
  BeforeBorn,
  BEFORE_BORN_ACTIVITIES_SCHEMA,
} from './model';

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
      { name: AfterBorn.name, schema: AFTER_BORN_ACTIVITIES_SCHEMA },
      {
        name: BeforeBorn.name,
        schema: BEFORE_BORN_ACTIVITIES_SCHEMA,
      },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
