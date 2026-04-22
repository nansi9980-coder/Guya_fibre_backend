import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { DevisModule } from './devis/devis.module';
import { ServicesContentModule } from './services-content/services-content.module';
import { RealisationsModule } from './realisations/realisations.module';
import { MediasModule } from './medias/medias.module';
import { SiteContentModule } from './site-content/site-content.module';
import { EmailTemplatesModule } from './email-templates/email-templates.module';
import { SettingsModule } from './settings/settings.module';
import { StatsModule } from './stats/stats.module';
import { LogsModule } from './logs/logs.module';
import { UsersModule } from './users/users.module';
import { ContactModule } from './contact/contact.module';
import { EmailModule } from './email/email.module';
import { RapportsModule } from './rapports/rapports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 100,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 300,
      },
    ]),
    AuthModule,
    DevisModule,
    ServicesContentModule,
    RealisationsModule,
    MediasModule,
    SiteContentModule,
    EmailTemplatesModule,
    SettingsModule,
    StatsModule,
    LogsModule,
    UsersModule,
    ContactModule,
    EmailModule,
    RapportsModule,
  ],
})
export class AppModule {}