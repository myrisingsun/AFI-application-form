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
exports.InvitationResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const invitation_entity_1 = require("../entities/invitation.entity");
class InvitationResponseDto {
}
exports.InvitationResponseDto = InvitationResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID приглашения' }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID кандидата' }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "candidateId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Токен приглашения' }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "token", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата истечения срока' }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "expiresAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Статус приглашения', enum: invitation_entity_1.InvitationStatus }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата отправки', nullable: true }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата открытия', nullable: true }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "openedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата завершения', nullable: true }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL для доступа к анкете' }),
    __metadata("design:type", String)
], InvitationResponseDto.prototype, "invitationUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Данные кандидата' }),
    __metadata("design:type", Object)
], InvitationResponseDto.prototype, "candidate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Отправитель приглашения' }),
    __metadata("design:type", Object)
], InvitationResponseDto.prototype, "createdBy", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата создания' }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Дата обновления' }),
    __metadata("design:type", Date)
], InvitationResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=invitation-response.dto.js.map