import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailTemplatesModule } from '../email-templates/email-templates.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [PrismaModule, EmailTemplatesModule, LogsModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService],
})
export class ContactModule {}
