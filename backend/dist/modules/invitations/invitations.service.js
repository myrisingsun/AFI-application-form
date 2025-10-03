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
exports.InvitationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto_1 = require("crypto");
const invitation_entity_1 = require("./entities/invitation.entity");
const candidate_entity_1 = require("../candidates/entities/candidate.entity");
const email_service_1 = require("../email/email.service");
let InvitationsService = class InvitationsService {
    constructor(invitationRepository, candidateRepository, emailService) {
        this.invitationRepository = invitationRepository;
        this.candidateRepository = candidateRepository;
        this.emailService = emailService;
    }
    async findAll() {
        const invitations = await this.invitationRepository.find({
            relations: ['candidate', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
        return invitations.map(invitation => this.mapToResponseDto(invitation));
    }
    async findOne(id) {
        const invitation = await this.invitationRepository.findOne({
            where: { id },
            relations: ['candidate', 'createdBy'],
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        return this.mapToResponseDto(invitation);
    }
    async findByToken(token) {
        const invitation = await this.invitationRepository.findOne({
            where: { token },
            relations: ['candidate', 'createdBy'],
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        if (invitation.status === invitation_entity_1.InvitationStatus.EXPIRED ||
            invitation.status === invitation_entity_1.InvitationStatus.REVOKED ||
            invitation.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Приглашение недействительно');
        }
        return this.mapToResponseDto(invitation);
    }
    async createInvitation(createInvitationDto, userId) {
        let candidate = await this.candidateRepository.findOne({
            where: { email: createInvitationDto.email },
        });
        if (!candidate) {
            candidate = this.candidateRepository.create({
                ...createInvitationDto,
                status: candidate_entity_1.CandidateStatus.DRAFT,
            });
            candidate = await this.candidateRepository.save(candidate);
        }
        await this.revokeActiveInvitations(candidate.id);
        const token = this.generateToken();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 14);
        const invitation = this.invitationRepository.create({
            candidateId: candidate.id,
            createdById: userId,
            token,
            expiresAt,
            status: invitation_entity_1.InvitationStatus.PENDING,
        });
        const savedInvitation = await this.invitationRepository.save(invitation);
        const invitationWithRelations = await this.invitationRepository.findOne({
            where: { id: savedInvitation.id },
            relations: ['candidate', 'createdBy'],
        });
        try {
            await this.sendInvitationEmail(invitationWithRelations);
            await this.invitationRepository.update(invitationWithRelations.id, {
                status: invitation_entity_1.InvitationStatus.SENT,
                sentAt: new Date(),
            });
            invitationWithRelations.status = invitation_entity_1.InvitationStatus.SENT;
            invitationWithRelations.sentAt = new Date();
        }
        catch (error) {
            console.error('Failed to send invitation email:', error);
        }
        return this.mapToResponseDto(invitationWithRelations);
    }
    async resendInvitation(invitationId, userId) {
        const invitation = await this.invitationRepository.findOne({
            where: { id: invitationId },
            relations: ['candidate', 'createdBy'],
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        await this.invitationRepository.update(invitation.id, {
            status: invitation_entity_1.InvitationStatus.REVOKED,
            revokedAt: new Date(),
        });
        const createDto = {
            firstName: invitation.candidate.firstName,
            lastName: invitation.candidate.lastName,
            middleName: invitation.candidate.middleName,
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
        await this.invitationRepository.update(invitationId, {
            status: invitation_entity_1.InvitationStatus.REVOKED,
            revokedAt: new Date(),
        });
    }
    async markAsOpened(token, ipAddress, userAgent) {
        const invitation = await this.invitationRepository.findOne({
            where: { token },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        if (invitation.status === invitation_entity_1.InvitationStatus.PENDING || invitation.status === invitation_entity_1.InvitationStatus.SENT) {
            await this.invitationRepository.update(invitation.id, {
                status: invitation_entity_1.InvitationStatus.OPENED,
                openedAt: new Date(),
                ipAddress,
                userAgent,
            });
        }
    }
    async markAsCompleted(token) {
        const invitation = await this.invitationRepository.findOne({
            where: { token },
        });
        if (!invitation) {
            throw new common_1.NotFoundException('Приглашение не найдено');
        }
        await this.invitationRepository.update(invitation.id, {
            status: invitation_entity_1.InvitationStatus.COMPLETED,
            completedAt: new Date(),
        });
    }
    async revokeActiveInvitations(candidateId) {
        await this.invitationRepository
            .createQueryBuilder()
            .update(invitation_entity_1.Invitation)
            .set({
            status: invitation_entity_1.InvitationStatus.REVOKED,
            revokedAt: new Date(),
        })
            .where('candidateId = :candidateId', { candidateId })
            .andWhere('status IN (:...statuses)', {
            statuses: [invitation_entity_1.InvitationStatus.PENDING, invitation_entity_1.InvitationStatus.SENT, invitation_entity_1.InvitationStatus.OPENED],
        })
            .execute();
    }
    generateToken() {
        return (0, crypto_1.randomBytes)(32).toString('hex');
    }
    async sendInvitationEmail(invitation) {
        const expiryDate = new Intl.DateTimeFormat('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(invitation.expiresAt);
        await this.emailService.sendInvitationEmail({
            candidateFirstName: invitation.candidate.firstName,
            candidateLastName: invitation.candidate.lastName,
            candidateEmail: invitation.candidate.email,
            invitationUrl: this.mapToResponseDto(invitation).invitationUrl,
            expiryDate,
            recruiterName: `${invitation.createdBy.firstName} ${invitation.createdBy.lastName}`,
            recruiterEmail: invitation.createdBy.email,
        });
    }
    mapToResponseDto(invitation) {
        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        return {
            id: invitation.id,
            candidateId: invitation.candidateId,
            token: invitation.token,
            expiresAt: invitation.expiresAt,
            status: invitation.status,
            sentAt: invitation.sentAt,
            openedAt: invitation.openedAt,
            completedAt: invitation.completedAt,
            invitationUrl: `${baseUrl}/questionnaire/${invitation.token}`,
            candidate: {
                id: invitation.candidate.id,
                firstName: invitation.candidate.firstName,
                lastName: invitation.candidate.lastName,
                middleName: invitation.candidate.middleName,
                email: invitation.candidate.email,
                phone: invitation.candidate.phone,
                status: invitation.candidate.status,
            },
            createdBy: {
                id: invitation.createdBy.id,
                firstName: invitation.createdBy.firstName,
                lastName: invitation.createdBy.lastName,
                email: invitation.createdBy.email,
            },
            createdAt: invitation.createdAt,
            updatedAt: invitation.updatedAt,
        };
    }
};
exports.InvitationsService = InvitationsService;
exports.InvitationsService = InvitationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(invitation_entity_1.Invitation)),
    __param(1, (0, typeorm_1.InjectRepository)(candidate_entity_1.Candidate)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        email_service_1.EmailService])
], InvitationsService);
//# sourceMappingURL=invitations.service.js.map