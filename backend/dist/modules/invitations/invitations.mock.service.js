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
exports.InvitationsMockService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const invitation_entity_1 = require("./entities/invitation.entity");
const email_service_1 = require("../email/email.service");
const mockInvitations = [];
const mockCandidates = new Map();
let InvitationsMockService = class InvitationsMockService {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async findAll() {
        return mockInvitations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    async findOne(id) {
        const invitation = mockInvitations.find(inv => inv.id === id);
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        return invitation;
    }
    async findByToken(token) {
        const invitation = mockInvitations.find(inv => inv.token === token);
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        if (invitation.status === invitation_entity_1.InvitationStatus.EXPIRED ||
            invitation.status === invitation_entity_1.InvitationStatus.REVOKED ||
            new Date(invitation.expiresAt) < new Date()) {
            throw new common_1.BadRequestException('Приглашение недействительно');
        }
        return invitation;
    }
    async createInvitation(createInvitationDto, userId) {
        let candidate = mockCandidates.get(createInvitationDto.email);
        if (!candidate) {
            candidate = {
                id: this.generateId(),
                ...createInvitationDto,
                status: 'draft',
            };
            mockCandidates.set(createInvitationDto.email, candidate);
        }
        mockInvitations
            .filter(inv => inv.candidateId === candidate.id)
            .forEach(inv => {
            if ([invitation_entity_1.InvitationStatus.PENDING, invitation_entity_1.InvitationStatus.SENT, invitation_entity_1.InvitationStatus.OPENED].includes(inv.status)) {
                inv.status = invitation_entity_1.InvitationStatus.REVOKED;
                inv.revokedAt = new Date().toISOString();
            }
        });
        const token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14);
        const invitation = {
            id: this.generateId(),
            candidateId: candidate.id,
            token,
            expiresAt: expiresAt.toISOString(),
            status: invitation_entity_1.InvitationStatus.PENDING,
            sentAt: null,
            openedAt: null,
            completedAt: null,
            invitationUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/questionnaire/${token}`,
            candidate: {
                id: candidate.id,
                firstName: candidate.firstName,
                lastName: candidate.lastName,
                middleName: candidate.middleName || null,
                email: candidate.email,
                phone: candidate.phone,
                status: candidate.status,
            },
            createdBy: {
                id: userId,
                firstName: 'Test',
                lastName: 'Recruiter',
                email: 'recruiter@afi.local',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        mockInvitations.push(invitation);
        try {
            const expiryDate = new Intl.DateTimeFormat('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(new Date(invitation.expiresAt));
            await this.emailService.sendInvitationEmail({
                candidateFirstName: candidate.firstName,
                candidateLastName: candidate.lastName,
                candidateEmail: candidate.email,
                invitationUrl: invitation.invitationUrl,
                expiryDate,
                recruiterName: `${invitation.createdBy.firstName} ${invitation.createdBy.lastName}`,
                recruiterEmail: invitation.createdBy.email,
            });
            invitation.status = invitation_entity_1.InvitationStatus.SENT;
            invitation.sentAt = new Date().toISOString();
        }
        catch (error) {
            console.error('Failed to send email:', error);
        }
        return invitation;
    }
    async resendInvitation(invitationId, userId) {
        const invitation = await this.findOne(invitationId);
        invitation.status = invitation_entity_1.InvitationStatus.REVOKED;
        invitation.revokedAt = new Date().toISOString();
        const createDto = {
            firstName: invitation.candidate.firstName,
            lastName: invitation.candidate.lastName,
            middleName: invitation.candidate.middleName || undefined,
            email: invitation.candidate.email,
            phone: invitation.candidate.phone,
        };
        return this.createInvitation(createDto, userId);
    }
    async revokeInvitation(invitationId) {
        const invitation = await this.findOne(invitationId);
        if (invitation.status === invitation_entity_1.InvitationStatus.REVOKED) {
            throw new common_1.BadRequestException('Приглашение уже отозвано');
        }
        invitation.status = invitation_entity_1.InvitationStatus.REVOKED;
        invitation.revokedAt = new Date().toISOString();
    }
    async markAsOpened(token, ipAddress, userAgent) {
        const invitation = mockInvitations.find(inv => inv.token === token);
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        if (invitation.status === invitation_entity_1.InvitationStatus.PENDING || invitation.status === invitation_entity_1.InvitationStatus.SENT) {
            invitation.status = invitation_entity_1.InvitationStatus.OPENED;
            invitation.openedAt = new Date().toISOString();
        }
    }
    async markAsCompleted(token) {
        const invitation = mockInvitations.find(inv => inv.token === token);
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        invitation.status = invitation_entity_1.InvitationStatus.COMPLETED;
        invitation.completedAt = new Date().toISOString();
    }
    generateId() {
        return (0, crypto_1.randomBytes)(16).toString('hex');
    }
    generateToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
};
exports.InvitationsMockService = InvitationsMockService;
exports.InvitationsMockService = InvitationsMockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [email_service_1.EmailService])
], InvitationsMockService);
//# sourceMappingURL=invitations.mock.service.js.map