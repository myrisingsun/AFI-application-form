import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Questionnaire, QuestionnaireStatus } from './entities/questionnaire.entity';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';
import { Candidate, CandidateStatus } from '../candidates/entities/candidate.entity';

@Injectable()
export class QuestionnaireService {
  constructor(
    @InjectRepository(Questionnaire)
    private readonly questionnaireRepository: Repository<Questionnaire>,
    @InjectRepository(Candidate)
    private readonly candidateRepository: Repository<Candidate>,
  ) {}

  /**
   * Get or create questionnaire for a candidate by invitation token
   */
  async getOrCreateByToken(token: string): Promise<QuestionnaireResponseDto> {
    // In simplified mode, we'll use the token to find the candidate
    // For now, return a mock or implement token validation
    throw new BadRequestException('Method requires database connection');
  }

  /**
   * Get questionnaire by candidate ID
   */
  async findByCandidateId(candidateId: string): Promise<QuestionnaireResponseDto | null> {
    const questionnaire = await this.questionnaireRepository.findOne({
      where: { candidateId },
      relations: ['candidate'],
    });

    if (!questionnaire) {
      return null;
    }

    return this.mapToResponseDto(questionnaire);
  }

  /**
   * Update questionnaire (auto-save or step completion)
   */
  async update(
    candidateId: string,
    updateDto: UpdateQuestionnaireDto,
  ): Promise<QuestionnaireResponseDto> {
    let questionnaire = await this.questionnaireRepository.findOne({
      where: { candidateId },
      relations: ['candidate'],
    });

    if (!questionnaire) {
      // Create new questionnaire
      const candidate = await this.candidateRepository.findOne({
        where: { id: candidateId },
      });

      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }

      questionnaire = this.questionnaireRepository.create({
        candidateId,
        status: QuestionnaireStatus.DRAFT,
        ...updateDto,
      });
    } else {
      // Update existing questionnaire
      Object.assign(questionnaire, updateDto);
    }

    const saved = await this.questionnaireRepository.save(questionnaire);
    const withRelations = await this.questionnaireRepository.findOne({
      where: { id: saved.id },
      relations: ['candidate'],
    });

    return this.mapToResponseDto(withRelations);
  }

  /**
   * Submit questionnaire (final step)
   */
  async submit(candidateId: string): Promise<QuestionnaireResponseDto> {
    const questionnaire = await this.questionnaireRepository.findOne({
      where: { candidateId },
      relations: ['candidate'],
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    if (questionnaire.status === QuestionnaireStatus.SUBMITTED) {
      throw new BadRequestException('Questionnaire already submitted');
    }

    // Validate required fields
    this.validateQuestionnaireComplete(questionnaire);

    // Update status and submission timestamp
    questionnaire.status = QuestionnaireStatus.SUBMITTED;
    questionnaire.submittedAt = new Date();

    const saved = await this.questionnaireRepository.save(questionnaire);

    // Update candidate status
    await this.candidateRepository.update(candidateId, {
      status: CandidateStatus.QUESTIONNAIRE_SUBMITTED,
    });

    const withRelations = await this.questionnaireRepository.findOne({
      where: { id: saved.id },
      relations: ['candidate'],
    });

    return this.mapToResponseDto(withRelations);
  }

  /**
   * Get all questionnaires (for recruiters)
   */
  async findAll(): Promise<QuestionnaireResponseDto[]> {
    const questionnaires = await this.questionnaireRepository.find({
      relations: ['candidate'],
      order: { createdAt: 'DESC' },
    });

    return questionnaires.map((q) => this.mapToResponseDto(q));
  }

  /**
   * Get questionnaire by ID (for recruiters)
   */
  async findOne(id: string): Promise<QuestionnaireResponseDto> {
    const questionnaire = await this.questionnaireRepository.findOne({
      where: { id },
      relations: ['candidate'],
    });

    if (!questionnaire) {
      throw new NotFoundException('Questionnaire not found');
    }

    return this.mapToResponseDto(questionnaire);
  }

  /**
   * Validate that all required fields are filled
   */
  private validateQuestionnaireComplete(questionnaire: Questionnaire): void {
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

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(questionnaire: Questionnaire): QuestionnaireResponseDto {
    return {
      id: questionnaire.id,
      candidateId: questionnaire.candidateId,
      status: questionnaire.status,
      candidate: questionnaire.candidate
        ? {
            id: questionnaire.candidate.id,
            firstName: questionnaire.candidate.firstName,
            lastName: questionnaire.candidate.lastName,
            middleName: questionnaire.candidate.middleName,
            email: questionnaire.candidate.email,
            phone: questionnaire.candidate.phone,
          }
        : undefined,
      passportSeries: questionnaire.passportSeries,
      passportNumber: questionnaire.passportNumber,
      passportIssuer: questionnaire.passportIssuer,
      passportIssueDate: questionnaire.passportIssueDate,
      passportIssuerCode: questionnaire.passportIssuerCode,
      birthDate: questionnaire.birthDate,
      birthPlace: questionnaire.birthPlace,
      registrationAddress: questionnaire.registrationAddress,
      actualAddress: questionnaire.actualAddress,
      actualAddressSameAsRegistration: questionnaire.actualAddressSameAsRegistration,
      education: questionnaire.education,
      workExperience: questionnaire.workExperience,
      consents: questionnaire.consents,
      createdAt: questionnaire.createdAt,
      updatedAt: questionnaire.updatedAt,
      submittedAt: questionnaire.submittedAt,
    };
  }
}
