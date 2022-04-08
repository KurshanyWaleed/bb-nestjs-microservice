import { ForumModule } from './forum/forum.module';
import { FaqModule } from './faq/faq.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ForumModule, FaqModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
