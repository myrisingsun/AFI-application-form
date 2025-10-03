import { QuestionnaireService } from './questionnaire.service';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
export declare class QuestionnaireController {
    private readonly questionnaireService;
    constructor(questionnaireService: QuestionnaireService);
    findAll(): Promise<QuestionnaireResponseDto[]>;
    findOne(id: string): Promise<QuestionnaireResponseDto>;
    getByToken(token: string): Promise<QuestionnaireResponseDto>;
    updateByToken(token: string, updateDto: UpdateQuestionnaireDto): Promise<QuestionnaireResponseDto>;
    submitByToken(token: string): Promise<QuestionnaireResponseDto>;
}
