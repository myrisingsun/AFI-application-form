import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
export declare class QuestionnaireMockService {
    private questionnaires;
    private tokenToQuestionnaireMap;
    getOrCreateByToken(token: string): Promise<QuestionnaireResponseDto>;
    findByCandidateId(candidateId: string): Promise<QuestionnaireResponseDto | null>;
    updateByToken(token: string, updateDto: UpdateQuestionnaireDto): Promise<QuestionnaireResponseDto>;
    submitByToken(token: string): Promise<QuestionnaireResponseDto>;
    findAll(): Promise<QuestionnaireResponseDto[]>;
    findOne(id: string): Promise<QuestionnaireResponseDto>;
    private validateQuestionnaireComplete;
}
