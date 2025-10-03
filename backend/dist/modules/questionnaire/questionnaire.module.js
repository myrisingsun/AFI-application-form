"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionnaireModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const questionnaire_controller_1 = require("./questionnaire.controller");
const questionnaire_service_1 = require("./questionnaire.service");
const questionnaire_entity_1 = require("./entities/questionnaire.entity");
const candidate_entity_1 = require("../candidates/entities/candidate.entity");
let QuestionnaireModule = class QuestionnaireModule {
};
exports.QuestionnaireModule = QuestionnaireModule;
exports.QuestionnaireModule = QuestionnaireModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([questionnaire_entity_1.Questionnaire, candidate_entity_1.Candidate])],
        controllers: [questionnaire_controller_1.QuestionnaireController],
        providers: [questionnaire_service_1.QuestionnaireService],
        exports: [questionnaire_service_1.QuestionnaireService],
    })
], QuestionnaireModule);
//# sourceMappingURL=questionnaire.module.js.map