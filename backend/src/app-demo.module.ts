import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { EmailModule } from './modules/email/email.module';
// import { InvitationsController } from './modules/invitations/invitations.controller';
// import { InvitationsMockService } from './modules/invitations/invitations.mock.service';
// import { InvitationsService } from './modules/invitations/invitations.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [
    // {
    //   provide: InvitationsService,
    //   useClass: InvitationsMockService,
    // },
  ],
})
export class AppDemoModule {}