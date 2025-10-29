import { Module } from '@nestjs/common';
import { BookReviewsController } from './book-reviews.controller';
import { BookReviewsService } from './book-reviews.service';
import { PrismaModule } from '@/database/module/prisma.module';

@Module({
  imports: [],
  controllers: [BookReviewsController],
  providers: [BookReviewsService],
  exports: [],
})
export class BookReviewsModule { }
