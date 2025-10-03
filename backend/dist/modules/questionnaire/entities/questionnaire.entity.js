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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Questionnaire = exports.QuestionnaireStatus = void 0;
const typeorm_1 = require("typeorm");
const candidate_entity_1 = require("../../candidates/entities/candidate.entity");
var QuestionnaireStatus;
(function (QuestionnaireStatus) {
    QuestionnaireStatus["DRAFT"] = "draft";
    QuestionnaireStatus["SUBMITTED"] = "submitted";
})(QuestionnaireStatus || (exports.QuestionnaireStatus = QuestionnaireStatus = {}));
let Questionnaire = class Questionnaire {
};
exports.Questionnaire = Questionnaire;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Questionnaire.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('uuid'),
    __metadata("design:type", String)
], Questionnaire.prototype, "candidateId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => candidate_entity_1.Candidate, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", candidate_entity_1.Candidate)
], Questionnaire.prototype, "candidate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: QuestionnaireStatus,
        default: QuestionnaireStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Questionnaire.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 4, nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "passportSeries", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 6, nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "passportNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "passportIssuer", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Questionnaire.prototype, "passportIssueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "passportIssuerCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true }),
    __metadata("design:type", Date)
], Questionnaire.prototype, "birthDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "birthPlace", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "registrationAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Questionnaire.prototype, "actualAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Questionnaire.prototype, "actualAddressSameAsRegistration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Questionnaire.prototype, "education", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Array)
], Questionnaire.prototype, "workExperience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Questionnaire.prototype, "consents", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Questionnaire.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Questionnaire.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Questionnaire.prototype, "submittedAt", void 0);
exports.Questionnaire = Questionnaire = __decorate([
    (0, typeorm_1.Entity)('questionnaires')
], Questionnaire);
//# sourceMappingURL=questionnaire.entity.js.map