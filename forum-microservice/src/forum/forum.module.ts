import { ForumService } from './forum.service';
import { ForumController } from './forum.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ForumController],
  providers: [ForumService],
})
export class ForumModule {}
