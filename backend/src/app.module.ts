import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { InvitationsModule } from './modules/invitations/invitations.module';
import { QuestionnaireModule } from './modules/questionnaire/questionnaire.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SecurityCheckModule } from './modules/security-check/security-check.module';
import { ConsentsModule } from './modules/consents/consents.module';
import { ReportsModule } from './modules/reports/reports.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    DatabaseModule,

    // Redis queues
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Application modules
    AuthModule,
    CandidatesModule,
    InvitationsModule,
    QuestionnaireModule,
    DocumentsModule,
    NotificationsModule,
    SecurityCheckModule,
    ConsentsModule,
    ReportsModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}