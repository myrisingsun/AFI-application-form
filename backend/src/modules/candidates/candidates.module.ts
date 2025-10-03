import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { Candidate } from './entities/candidate.entity';
import { Questionnaire } from './entities/questionnaire.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Candidate, Questionnaire])],
  controllers: [CandidatesController],
  providers: [CandidatesService],
  exports: [CandidatesService],
})
export class CandidatesModule {}