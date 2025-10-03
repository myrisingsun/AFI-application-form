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
exports.Candidate = exports.CandidateStatus = void 0;
const typeorm_1 = require("typeorm");
const questionnaire_entity_1 = require("./questionnaire.entity");
var CandidateStatus;
(function (CandidateStatus) {
    CandidateStatus["DRAFT"] = "draft";
    CandidateStatus["QUESTIONNAIRE_SUBMITTED"] = "questionnaire_submitted";
    CandidateStatus["SECURITY_CHECK_PENDING"] = "security_check_pending";
    CandidateStatus["SECURITY_CHECK_APPROVED"] = "security_check_approved";
    CandidateStatus["SECURITY_CHECK_REJECTED"] = "security_check_rejected";
    CandidateStatus["DOCUMENTS_PENDING"] = "documents_pending";
    CandidateStatus["DOCUMENTS_UPLOADED"] = "documents_uploaded";
    CandidateStatus["READY_FOR_1C"] = "ready_for_1c";
    CandidateStatus["TRANSFERRED_TO_1C"] = "transferred_to_1c";
    CandidateStatus["COMPLETED"] = "completed";
    CandidateStatus["REJECTED"] = "rejected";
})(CandidateStatus || (exports.CandidateStatus = CandidateStatus = {}));
let Candidate = class Candidate {
    get fullName() {
        return [this.firstName, this.middleName, this.lastName]
            .filter(Boolean)
            .join(' ');
    }
};
exports.Candidate = Candidate;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Candidate.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Candidate.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Candidate.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "middleName", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Candidate.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Candidate.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CandidateStatus,
        default: CandidateStatus.DRAFT,
    }),
    __metadata("design:type", String)
], Candidate.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "invitationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Candidate.prototype, "invitationExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "documentsToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Candidate.prototype, "documentsExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Candidate.prototype, "securityCheckComment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Candidate.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => questionnaire_entity_1.Questionnaire, (questionnaire) => questionnaire.candidate),
    __metadata("design:type", questionnaire_entity_1.Questionnaire)
], Candidate.prototype, "questionnaire", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Candidate.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Candidate.prototype, "updatedAt", void 0);
exports.Candidate = Candidate = __decorate([
    (0, typeorm_1.Entity)('candidates')
], Candidate);
//# sourceMappingURL=candidate.entity.js.map