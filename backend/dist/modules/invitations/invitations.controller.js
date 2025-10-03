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
exports.InvitationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const invitations_service_1 = require("./invitations.service");
const create_invitation_dto_1 = require("./dto/create-invitation.dto");
const invitation_response_dto_1 = require("./dto/invitation-response.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const user_entity_1 = require("../auth/entities/user.entity");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let InvitationsController = class InvitationsController {
    constructor(invitationsService) {
        this.invitationsService = invitationsService;
    }
    async findAll() {
        return this.invitationsService.findAll();
    }
    async findOne(id) {
        return this.invitationsService.findOne(id);
    }
    async create(createInvitationDto, user) {
        return this.invitationsService.createInvitation(createInvitationDto, user.id);
    }
    async resend(id, user) {
        return this.invitationsService.resendInvitation(id, user.id);
    }
    async revoke(id) {
        return this.invitationsService.revokeInvitation(id);
    }
    async findByToken(token) {
        return this.invitationsService.findByToken(token);
    }
    async markAsOpened(token, ip, userAgent) {
        return this.invitationsService.markAsOpened(token, ip, userAgent);
    }
    async markAsCompleted(token) {
        return this.invitationsService.markAsCompleted(token);
    }
};
exports.InvitationsController = InvitationsController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить все приглашения' }),
    (0, swagger_1.ApiResponse)({ type: [invitation_response_dto_1.InvitationResponseDto] }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.RECRUITER),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findAll", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить приглашение по ID' }),
    (0, swagger_1.ApiResponse)({ type: invitation_response_dto_1.InvitationResponseDto }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.RECRUITER),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findOne", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Создать новое приглашение' }),
    (0, swagger_1.ApiBody)({ type: create_invitation_dto_1.CreateInvitationDto }),
    (0, swagger_1.ApiResponse)({ type: invitation_response_dto_1.InvitationResponseDto }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.RECRUITER),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_invitation_dto_1.CreateInvitationDto, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "create", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Повторно отправить приглашение' }),
    (0, swagger_1.ApiResponse)({ type: invitation_response_dto_1.InvitationResponseDto }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.RECRUITER),
    (0, common_1.Post)(':id/resend'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "resend", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отозвать приглашение' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.RECRUITER),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "revoke", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Получить приглашение по токену (для кандидата)' }),
    (0, swagger_1.ApiResponse)({ type: invitation_response_dto_1.InvitationResponseDto }),
    (0, common_1.Get)('public/token/:token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "findByToken", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отметить приглашение как открытое' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Post)('public/token/:token/open'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Ip)()),
    __param(2, (0, common_1.Headers)('user-agent')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "markAsOpened", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Отметить приглашение как завершённое' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, common_1.Post)('public/token/:token/complete'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsController.prototype, "markAsCompleted", null);
exports.InvitationsController = InvitationsController = __decorate([
    (0, swagger_1.ApiTags)('invitations'),
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [invitations_service_1.InvitationsService])
], InvitationsController);
//# sourceMappingURL=invitations.controller.js.map