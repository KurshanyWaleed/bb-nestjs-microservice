import { ForumModule } from './../forum/forum.module';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS, USER_MS_PORT } from 'src/constantes';
import { Question, QuestionSchema } from './faq.models';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_CONNXION'),
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: USERS,
        transport: Transport.TCP,
        options: { port: USER_MS_PORT },
      },
    ]),
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
