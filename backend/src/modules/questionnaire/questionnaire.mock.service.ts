import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
import { QuestionnaireStatus } from './entities/questionnaire.entity';
import { v4 as uuidv4 } from 'uuid';

interface InMemoryQuestionnaire extends QuestionnaireResponseDto {
  token?: string;
}

@Injectable()
export class QuestionnaireMockService {
  private questionnaires: Map<string, InMemoryQuestionnaire> = new Map();
  private tokenToQuestionnaireMap: Map<string, string> = new Map(); // token -> questionnaireId

  /**
   * Get or create questionnaire for a candidate by invitation token
   */
  async getOrCreateByToken(token: string): Promise<QuestionnaireResponseDto> {
    // Check if questionnaire exists for this token
    const existingId = this.tokenToQuestionnaireMap.get(token);

    if (existingId) {
      const questionnaire = this.questionnaires.get(existingId);
      if (questionnaire) {
        return questionnaire;
      }
    }

    // Create new questionnaire (mock candidate data)
    const candidateId = uuidv4();
    const questionnaireId = uuidv4();

    const newQuestionnaire: InMemoryQuestionnaire = {
      id: questionnaireId,
      candidateId,
      status: QuestionnaireStatus.DRAFT,
      candidate: {
        id: candidateId,
        firstName: 'Иван',
        lastName: 'Иванов',
        middleName: 'Иванович',
        email: 'ivan@example.com',
        phone: '+7 999 123-45-67',
      },
      actualAddressSameAsRegistration: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.questionnaires.set(questionnaireId, newQuestionnaire);
    this.tokenToQuestionnaireMap.set(token, questionnaireId);

    return newQuestionnaire;
  }

  /**
   * Get questionnaire by candidate ID
   */
  async findByCandidateId(candidateId: string): Promise<QuestionnaireResponseDto | null> {
    for (const questionnaire of this.questionnaires.values()) {
      if (questionnaire.candidateId === candidateId) {
        return questionnaire;
      }
    }
    return null;
  }

  /**
   * Update questionnaire by token
   */
  async updateByToken(
    token: string,
    updateDto: UpdateQuestionnaireDto,
  ): Promise<QuestionnaireResponseDto> {
    const questionnaireId = this.tokenToQuestionnaireMap.get(token);

    if (!questionnaireId) {
      throw new NotFoundException('Questionnaire not found for this token');
    }

    const questionnaire = this.questionnaires.get(questionnaireId);

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    // Update questionnaire
    Object.assign(questionnaire, updateDto, { updatedAt: new Date() });

    return questionnaire;
  }

  /**
   * Submit questionnaire (final step)
   */
  async submitByToken(token: string): Promise<QuestionnaireResponseDto> {
    const questionnaireId = this.tokenToQuestionnaireMap.get(token);

    if (!questionnaireId) {
      throw new NotFoundException('Questionnaire not found for this token');
    }

    const questionnaire = this.questionnaires.get(questionnaireId);

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    if (questionnaire.status === QuestionnaireStatus.SUBMITTED) {
      throw new BadRequestException('Questionnaire already submitted');
    }

    // Validate required fields
    this.validateQuestionnaireComplete(questionnaire);

    // Update status
    questionnaire.status = QuestionnaireStatus.SUBMITTED;
    questionnaire.submittedAt = new Date();
    questionnaire.updatedAt = new Date();

    return questionnaire;
  }

  /**
   * Get all questionnaires (for recruiters)
   */
  async findAll(): Promise<QuestionnaireResponseDto[]> {
    return Array.from(this.questionnaires.values());
  }

  /**
   * Get questionnaire by ID (for recruiters)
   */
  async findOne(id: string): Promise<QuestionnaireResponseDto> {
    const questionnaire = this.questionnaires.get(id);

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    return questionnaire;
  }

  /**
   * Validate that all required fields are filled
   */
  private validateQuestionnaireComplete(questionnaire: InMemoryQuestionnaire): void {
    const errors: string[] = [];

    // Step 2: Passport validation
    if (!questionnaire.passportSeries) errors.push('Passport series is required');
    if (!questionnaire.passportNumber) errors.push('Passport number is required');
    if (!questionnaire.passportIssuer) errors.push('Passport issuer is required');
    if (!questionnaire.passportIssueDate) errors.push('Passport issue date is required');
    if (!questionnaire.passportIssuerCode) errors.push('Passport issuer code is required');
    if (!questionnaire.birthDate) errors.push('Birth date is required');
    if (!questionnaire.birthPlace) errors.push('Birth place is required');

    // Step 3: Address validation
    if (!questionnaire.registrationAddress) errors.push('Registration address is required');
    if (!questionnaire.actualAddressSameAsRegistration && !questionnaire.actualAddress) {
      errors.push('Actual address is required');
    }

    // Step 4: Education validation
    if (!questionnaire.education || questionnaire.education.length === 0) {
      errors.push('At least one education entry is required');
    }

    // Step 5: Consents validation
    if (!questionnaire.consents) {
      errors.push('Consents are required');
    } else {
      if (!questionnaire.consents.pdnConsent) {
        errors.push('Personal data processing consent is required');
      }
      if (!questionnaire.consents.backgroundCheckConsent) {
        errors.push('Background check consent is required');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException({
        message: 'Questionnaire is incomplete',
        errors,
      });
    }
  }
}
