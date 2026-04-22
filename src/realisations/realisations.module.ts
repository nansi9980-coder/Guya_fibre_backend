import { Module } from '@nestjs/common';
import { RealisationsService } from './realisations.service';
import { RealisationsController } from './realisations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [PrismaModule, LogsModule],
  controllers: [RealisationsController],
  providers: [RealisationsService],
  exports: [RealisationsService],
})
export class RealisationsModule {}