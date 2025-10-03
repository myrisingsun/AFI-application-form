"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireMockService = void 0;
const common_1 = require("@nestjs/common");
const questionnaire_entity_1 = require("./entities/questionnaire.entity");
const uuid_1 = require("uuid");
let QuestionnaireMockService = class QuestionnaireMockService {
    constructor() {
        this.questionnaires = new Map();
        this.tokenToQuestionnaireMap = new Map();
    }
    async getOrCreateByToken(token) {
        const existingId = this.tokenToQuestionnaireMap.get(token);
        if (existingId) {
            const questionnaire = this.questionnaires.get(existingId);
            if (questionnaire) {
                return questionnaire;
            }
        }
        const candidateId = (0, uuid_1.v4)();
        const questionnaireId = (0, uuid_1.v4)();
        const newQuestionnaire = {
            id: questionnaireId,
            candidateId,
            status: questionnaire_entity_1.QuestionnaireStatus.DRAFT,
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
    async findByCandidateId(candidateId) {
        for (const questionnaire of this.questionnaires.values()) {
            if (questionnaire.candidateId === candidateId) {
                return questionnaire;
            }
        }
        return null;
    }
    async updateByToken(token, updateDto) {
        const questionnaireId = this.tokenToQuestionnaireMap.get(token);
        if (!questionnaireId) {
            throw new common_1.NotFoundException('Questionnaire not found for this token');
        }
        const questionnaire = this.questionnaires.get(questionnaireId);
        if (!questionnaire) {
            throw new common_1.NotFoundException('Questionnaire not found');
        }
        Object.assign(questionnaire, updateDto, { updatedAt: new Date() });
        return questionnaire;
    }
    async submitByToken(token) {
        const questionnaireId = this.tokenToQuestionnaireMap.get(token);
        if (!questionnaireId) {
            throw new common_1.NotFoundException('Questionnaire not found for this token');
        }
        const questionnaire = this.questionnaires.get(questionnaireId);
        if (!questionnaire) {
            throw new common_1.NotFoundException('Questionnaire not found');
        }
        if (questionnaire.status === questionnaire_entity_1.QuestionnaireStatus.SUBMITTED) {
            throw new common_1.BadRequestException('Questionnaire already submitted');
        }
        this.validateQuestionnaireComplete(questionnaire);
        questionnaire.status = questionnaire_entity_1.QuestionnaireStatus.SUBMITTED;
        questionnaire.submittedAt = new Date();
        questionnaire.updatedAt = new Date();
        return questionnaire;
    }
    async findAll() {
        return Array.from(this.questionnaires.values());
    }
    async findOne(id) {
        const questionnaire = this.questionnaires.get(id);
        if (!questionnaire) {
            throw new common_1.NotFoundException('Questionnaire not found');
        }
        return questionnaire;
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
};
exports.QuestionnaireMockService = QuestionnaireMockService;
exports.QuestionnaireMockService = QuestionnaireMockService = __decorate([
    (0, common_1.Injectable)()
], QuestionnaireMockService);
//# sourceMappingURL=questionnaire.mock.service.js.map