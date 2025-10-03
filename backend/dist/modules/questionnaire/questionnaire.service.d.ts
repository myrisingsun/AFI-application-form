import { Repository } from 'typeorm';
import { Questionnaire } from './entities/questionnaire.entity';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
import { Candidate } from '../candidates/entities/candidate.entity';
export declare class QuestionnaireService {
    private readonly questionnaireRepository;
    private readonly candidateRepository;
    constructor(questionnaireRepository: Repository<Questionnaire>, candidateRepository: Repository<Candidate>);
    getOrCreateByToken(token: string): Promise<QuestionnaireResponseDto>;
    findByCandidateId(candidateId: string): Promise<QuestionnaireResponseDto | null>;
    update(candidateId: string, updateDto: UpdateQuestionnaireDto): Promise<QuestionnaireResponseDto>;
    submit(candidateId: string): Promise<QuestionnaireResponseDto>;
    findAll(): Promise<QuestionnaireResponseDto[]>;
    findOne(id: string): Promise<QuestionnaireResponseDto>;
    private validateQuestionnaireComplete;
    private mapToResponseDto;
}
