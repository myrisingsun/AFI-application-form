import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from './entities/candidate.entity';
import { Questionnaire } from './entities/questionnaire.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    @InjectRepository(Questionnaire)
    private questionnaireRepository: Repository<Questionnaire>,
  ) {}

  async findAll(): Promise<Candidate[]> {
    return this.candidateRepository.find({
      relations: ['questionnaire'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Candidate> {
    return this.candidateRepository.findOne({
      where: { id },
      relations: ['questionnaire'],
    });
  }

  async create(candidateData: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidateRepository.create(candidateData);
    return this.candidateRepository.save(candidate);
  }

  async update(id: string, updateData: Partial<Candidate>): Promise<Candidate> {
    await this.candidateRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.candidateRepository.delete(id);
  }
}