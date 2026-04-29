import { Module } from '@nestjs/common';
import { EmailTemplatesService } from './email-templates.service';
import { EmailTemplatesController } from './email-templates.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { LogsModule } from '../logs/logs.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [PrismaModule, LogsModule, EmailModule],
  controllers: [EmailTemplatesController],
  providers: [EmailTemplatesService],
  exports: [EmailTemplatesService],
})
export class EmailTemplatesModule {}