import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InvitationStatus } from './entities/invitation.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from '@/modules/email/email.service';

// Mock data storage
const mockInvitations: InvitationResponseDto[] = [];
const mockCandidates = new Map();

@Injectable()
export class InvitationsMockService {
  constructor(private emailService: EmailService) {}

  async findAll(): Promise<InvitationResponseDto[]> {
    return mockInvitations.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async findOne(id: string): Promise<InvitationResponseDto> {
    const invitation = mockInvitations.find(inv => inv.id === id);
    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }
    return invitation;
  }

  async findByToken(token: string): Promise<InvitationResponseDto> {
    const invitation = mockInvitations.find(inv => inv.token === token);
    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status === InvitationStatus.EXPIRED ||
        invitation.status === InvitationStatus.REVOKED ||
        new Date(invitation.expiresAt) < new Date()) {
      throw new BadRequestException('Приглашение недействительно');
    }

    return invitation;
  }

  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    userId: string,
  ): Promise<InvitationResponseDto> {
    // Create or find candidate
    let candidate = mockCandidates.get(createInvitationDto.email);

    if (!candidate) {
      candidate = {
        id: this.generateId(),
        ...createInvitationDto,
        status: 'draft',
      };
      mockCandidates.set(createInvitationDto.email, candidate);
    }

    // Revoke active invitations for this candidate
    mockInvitations
      .filter(inv => inv.candidateId === candidate.id)
      .forEach(inv => {
        if ([InvitationStatus.PENDING, InvitationStatus.SENT, InvitationStatus.OPENED].includes(inv.status)) {
          inv.status = InvitationStatus.REVOKED;
          inv.revokedAt = new Date().toISOString();
        }
      });

    // Create new invitation
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);

    const invitation: InvitationResponseDto = {
      id: this.generateId(),
      candidateId: candidate.id,
      token,
      expiresAt: expiresAt.toISOString(),
      status: InvitationStatus.PENDING,
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

    // Send email
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

      invitation.status = InvitationStatus.SENT;
      invitation.sentAt = new Date().toISOString();
    } catch (error) {
      console.error('Failed to send email:', error);
    }

    return invitation;
  }

  async resendInvitation(invitationId: string, userId: string): Promise<InvitationResponseDto> {
    const invitation = await this.findOne(invitationId);

    // Revoke current
    invitation.status = InvitationStatus.REVOKED;
    invitation.revokedAt = new Date().toISOString();

    // Create new one
    const createDto: CreateInvitationDto = {
      firstName: invitation.candidate.firstName,
      lastName: invitation.candidate.lastName,
      middleName: invitation.candidate.middleName || undefined,
      email: invitation.candidate.email,
      phone: invitation.candidate.phone,
    };

    return this.createInvitation(createDto, userId);
  }

  async revokeInvitation(invitationId: string): Promise<void> {
    const invitation = await this.findOne(invitationId);

    if (invitation.status === InvitationStatus.REVOKED) {
      throw new BadRequestException('Приглашение уже отозвано');
    }

    invitation.status = InvitationStatus.REVOKED;
    invitation.revokedAt = new Date().toISOString();
  }

  async markAsOpened(token: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const invitation = mockInvitations.find(inv => inv.token === token);
    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status === InvitationStatus.PENDING || invitation.status === InvitationStatus.SENT) {
      invitation.status = InvitationStatus.OPENED;
      invitation.openedAt = new Date().toISOString();
    }
  }

  async markAsCompleted(token: string): Promise<void> {
    const invitation = mockInvitations.find(inv => inv.token === token);
    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    invitation.status = InvitationStatus.COMPLETED;
    invitation.completedAt = new Date().toISOString();
  }

  private generateId(): string {
    return randomBytes(16).toString('hex');
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }
}