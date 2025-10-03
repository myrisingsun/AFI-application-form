"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const questionnaire_entity_1 = require("./entities/questionnaire.entity");
const candidate_entity_1 = require("../candidates/entities/candidate.entity");
let QuestionnaireService = class QuestionnaireService {
    constructor(questionnaireRepository, candidateRepository) {
        this.questionnaireRepository = questionnaireRepository;
        this.candidateRepository = candidateRepository;
    }
    async getOrCreateByToken(token) {
        throw new common_1.BadRequestException('Method requires database connection');
    }
    async findByCandidateId(candidateId) {
        const questionnaire = await this.questionnaireRepository.findOne({
            where: { candidateId },
            relations: ['candidate'],
        });
        if (!questionnaire) {
            return null;
        }
        return this.mapToResponseDto(questionnaire);
    }
    async update(candidateId, updateDto) {
        let questionnaire = await this.questionnaireRepository.findOne({
            where: { candidateId },
            relations: ['candidate'],
        });
        if (!questionnaire) {
            const candidate = await this.candidateRepository.findOne({
                where: { id: candidateId },
            });
            if (!candidate) {
                throw new common_1.NotFoundException('Candidate not found');
            }
            questionnaire = this.questionnaireRepository.create({
                candidateId,
                status: questionnaire_entity_1.QuestionnaireStatus.DRAFT,
                ...updateDto,
            });
        }
        else {
            Object.assign(questionnaire, updateDto);
        }
        const saved = await this.questionnaireRepository.save(questionnaire);
        const withRelations = await this.questionnaireRepository.findOne({
            where: { id: saved.id },
            relations: ['candidate'],
        });
        return this.mapToResponseDto(withRelations);
    }
    async submit(candidateId) {
        const questionnaire = await this.questionnaireRepository.findOne({
            where: { candidateId },
            relations: ['candidate'],
        });
        if (!questionnaire) {
            throw new common_1.NotFoundException('Questionnaire not found');
        }
        if (questionnaire.status === questionnaire_entity_1.QuestionnaireStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Questionnaire already submitted');
        }
        this.validateQuestionnaireComplete(questionnaire);
        questionnaire.status = questionnaire_entity_1.QuestionnaireStatus.SUBMITTED;
        questionnaire.submittedAt = new Date();
        const saved = await this.questionnaireRepository.save(questionnaire);
        await this.candidateRepository.update(candidateId, {
            status: candidate_entity_1.CandidateStatus.QUESTIONNAIRE_SUBMITTED,
        });
        const withRelations = await this.questionnaireRepository.findOne({
            where: { id: saved.id },
            relations: ['candidate'],
        });
        return this.mapToResponseDto(withRelations);
    }
    async findAll() {
        const questionnaires = await this.questionnaireRepository.find({
            relations: ['candidate'],
            order: { createdAt: 'DESC' },
        });
        return questionnaires.map((q) => this.mapToResponseDto(q));
    }
    async findOne(id) {
        const questionnaire = await this.questionnaireRepository.findOne({
            where: { id },
            relations: ['candidate'],
        });
        if (!questionnaire) {
            throw new common_1.NotFoundException('Questionnaire not found');
        }
        return this.mapToResponseDto(questionnaire);
    }
    validateQuestionnaireComplete(questionnaire) {
        const errors = [];
        if (!questionnaire.passportSeries)
            errors.push('Passport series is required');
        if (!questionnaire.passportNumber)
            errors.push('Passport number is required');
        if (!questionnaire.passportIssuer)
            errors.push('Passport issuer is required');
        if (!questionnaire.passportIssueDate)
            errors.push('Passport issue date is required');
        if (!questionnaire.passportIssuerCode)
            errors.push('Passport issuer code is required');
        if (!questionnaire.birthDate)
            errors.push('Birth date is required');
        if (!questionnaire.birthPlace)
            errors.push('Birth place is required');
        if (!questionnaire.registrationAddress)
            errors.push('Registration address is required');
        if (!questionnaire.actualAddressSameAsRegistration && !questionnaire.actualAddress) {
            errors.push('Actual address is required');
        }
        if (!questionnaire.education || questionnaire.education.length === 0) {
            errors.push('At least one education entry is required');
        }
        if (!questionnaire.consents) {
            errors.push('Consents are required');
        }
        else {
            if (!questionnaire.consents.pdnConsent) {
                errors.push('Personal data processing consent is required');
            }
            if (!questionnaire.consents.backgroundCheckConsent) {
                errors.push('Background check consent is required');
            }
        }
        if (errors.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Questionnaire is incomplete',
                errors,
            });
        }
    }
    mapToResponseDto(questionnaire) {
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
};
exports.QuestionnaireService = QuestionnaireService;
exports.QuestionnaireService = QuestionnaireService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(questionnaire_entity_1.Questionnaire)),
    __param(1, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], QuestionnaireService);
//# sourceMappingURL=questionnaire.service.js.map