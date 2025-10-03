import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { QuestionnaireController } from './modules/questionnaire/questionnaire.controller';
import { QuestionnaireService } from './modules/questionnaire/questionnaire.service';
import { QuestionnaireMockService } from './modules/questionnaire/questionnaire.mock.service';

@Module({
  imports: [
    // Environment configuration only
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
  ],
  controllers: [AppController, QuestionnaireController],
  providers: [
    {
      provide: QuestionnaireService,
      useClass: QuestionnaireMockService,
    },
  ],
})
export class AppSimpleModule {}