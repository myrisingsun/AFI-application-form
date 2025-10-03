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
exports.QuestionnaireController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const questionnaire_service_1 = require("./questionnaire.service");
const update_questionnaire_dto_1 = require("./dto/update-questionnaire.dto");
let QuestionnaireController = class QuestionnaireController {
    constructor(questionnaireService) {
        this.questionnaireService = questionnaireService;
    }
    async findAll() {
        const service = this.questionnaireService;
        if (service.findAll) {
            return service.findAll();
        }
        return [];
    }
    async findOne(id) {
        const service = this.questionnaireService;
        if (service.findOne) {
            return service.findOne(id);
        }
        throw new Error('Not implemented');
    }
    async getByToken(token) {
        return this.questionnaireService.getOrCreateByToken(token);
    }
    async updateByToken(token, updateDto) {
        const service = this.questionnaireService;
        if (service.updateByToken) {
            return service.updateByToken(token, updateDto);
        }
        throw new Error('Token validation not implemented in this mode');
    }
    async submitByToken(token) {
        const service = this.questionnaireService;
        if (service.submitByToken) {
            return service.submitByToken(token);
        }
        throw new Error('Token validation not implemented in this mode');
    }
};
exports.QuestionnaireController = QuestionnaireController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all questionnaires' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of all questionnaires' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuestionnaireController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get questionnaire by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire details' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Questionnaire not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionnaireController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)('token/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Get questionnaire by invitation token' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire details or empty draft' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionnaireController.prototype, "getByToken", null);
__decorate([
    (0, common_1.Post)('token/:token'),
    (0, swagger_1.ApiOperation)({ summary: 'Update questionnaire (auto-save)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire updated' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_questionnaire_dto_1.UpdateQuestionnaireDto]),
    __metadata("design:returntype", Promise)
], QuestionnaireController.prototype, "updateByToken", null);
__decorate([
    (0, common_1.Post)('token/:token/submit'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit questionnaire (final step)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Questionnaire submitted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Questionnaire incomplete or already submitted' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Invalid or expired token' }),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QuestionnaireController.prototype, "submitByToken", null);
exports.QuestionnaireController = QuestionnaireController = __decorate([
    (0, swagger_1.ApiTags)('questionnaires'),
    (0, common_1.Controller)('questionnaires'),
    __metadata("design:paramtypes", [questionnaire_service_1.QuestionnaireService])
], QuestionnaireController);
//# sourceMappingURL=questionnaire.controller.js.map