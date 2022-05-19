import { Question, QuestionSchema } from './../faq/faq.models';
import { Reply, replySchema } from './reply.model';
import { Group, groupSchema } from './group.model';
import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Post, postSchema } from './post.model';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { USERS, USER_MS_PORT } from 'src/constantes';
import { FaqModule } from 'src/faq/faq.module';

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
      { name: Reply.name, schema: replySchema },
      { name: Post.name, schema: postSchema },
      { name: Group.name, schema: groupSchema },
      { name: Question.name, schema: QuestionSchema },
    ]),
  ],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
