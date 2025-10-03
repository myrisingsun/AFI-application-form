import { Repository } from 'typeorm';
import { Candidate } from './entities/candidate.entity';
import { Questionnaire } from './entities/questionnaire.entity';
export declare class CandidatesService {
    private candidateRepository;
    private questionnaireRepository;
    constructor(candidateRepository: Repository<Candidate>, questionnaireRepository: Repository<Questionnaire>);
    findAll(): Promise<Candidate[]>;
    findOne(id: string): Promise<Candidate>;
    create(candidateData: Partial<Candidate>): Promise<Candidate>;
    update(id: string, updateData: Partial<Candidate>): Promise<Candidate>;
    remove(id: string): Promise<void>;
}
