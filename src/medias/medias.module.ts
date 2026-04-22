import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MediasService } from './medias.service';
import { MediasController } from './medias.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [
    PrismaModule,
    LogsModule,
    MulterModule.register({
      limits: { fileSize: 100 * 1024 * 1024 }, // 100MB — images, vidéos, documents
    }),
  ],
  controllers: [MediasController],
  providers: [MediasService],
  exports: [MediasService],
})
export class MediasModule {}