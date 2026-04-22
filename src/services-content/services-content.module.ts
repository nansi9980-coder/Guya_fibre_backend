import { Module } from '@nestjs/common';
import { ServicesContentService } from './services-content.service';
import { ServicesContentController } from './services-content.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [ServicesContentController],
  providers: [ServicesContentService],
  exports: [ServicesContentService],
})
export class ServicesContentModule {}