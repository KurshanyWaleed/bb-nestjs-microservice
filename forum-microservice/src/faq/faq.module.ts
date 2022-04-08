import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
