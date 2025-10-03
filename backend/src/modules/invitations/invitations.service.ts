import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';

import { Invitation, InvitationStatus } from './entities/invitation.entity';
import { Candidate, CandidateStatus } from '@/modules/candidates/entities/candidate.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from '@/modules/email/email.service';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectRepository(Invitation)
    private invitationRepository: Repository<Invitation>,
    @InjectRepository(Candidate)
    private candidateRepository: Repository<Candidate>,
    private emailService: EmailService,
  ) {}

  async findAll(): Promise<InvitationResponseDto[]> {
    const invitations = await this.invitationRepository.find({
      relations: ['candidate', 'createdBy'],
      order: { createdAt: 'DESC' },
    });

    return invitations.map(invitation => this.mapToResponseDto(invitation));
  }

  async findOne(id: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({
      where: { id },
      relations: ['candidate', 'createdBy'],
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    return this.mapToResponseDto(invitation);
  }

  async findByToken(token: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
      relations: ['candidate', 'createdBy'],
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status === InvitationStatus.EXPIRED ||
        invitation.status === InvitationStatus.REVOKED ||
        invitation.expiresAt < new Date()) {
      throw new BadRequestException('Приглашение недействительно');
    }

    return this.mapToResponseDto(invitation);
  }

  async createInvitation(
    createInvitationDto: CreateInvitationDto,
    userId: string,
  ): Promise<InvitationResponseDto> {
    // Создаем или находим кандидата
    let candidate = await this.candidateRepository.findOne({
      where: { email: createInvitationDto.email },
    });

    if (!candidate) {
      candidate = this.candidateRepository.create({
        ...createInvitationDto,
        status: CandidateStatus.DRAFT,
      });
      candidate = await this.candidateRepository.save(candidate);
    }

    // Деактивируем предыдущие приглашения для этого кандидата
    await this.revokeActiveInvitations(candidate.id);

    // Создаем новое приглашение
    const token = this.generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14); // 14 дней

    const invitation = this.invitationRepository.create({
      candidateId: candidate.id,
      createdById: userId,
      token,
      expiresAt,
      status: InvitationStatus.PENDING,
    });

    const savedInvitation = await this.invitationRepository.save(invitation);

    // Загружаем с отношениями
    const invitationWithRelations = await this.invitationRepository.findOne({
      where: { id: savedInvitation.id },
      relations: ['candidate', 'createdBy'],
    });

    // Отправляем email приглашение
    try {
      await this.sendInvitationEmail(invitationWithRelations);

      // Обновляем статус на SENT
      await this.invitationRepository.update(invitationWithRelations.id, {
        status: InvitationStatus.SENT,
        sentAt: new Date(),
      });

      invitationWithRelations.status = InvitationStatus.SENT;
      invitationWithRelations.sentAt = new Date();
    } catch (error) {
      // Если email не отправился, оставляем статус PENDING
      console.error('Failed to send invitation email:', error);
    }

    return this.mapToResponseDto(invitationWithRelations);
  }

  async resendInvitation(invitationId: string, userId: string): Promise<InvitationResponseDto> {
    const invitation = await this.invitationRepository.findOne({
      where: { id: invitationId },
      relations: ['candidate', 'createdBy'],
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    // Деактивируем текущее приглашение
    await this.invitationRepository.update(invitation.id, {
      status: InvitationStatus.REVOKED,
      revokedAt: new Date(),
    });

    // Создаем новое приглашение
    const createDto: CreateInvitationDto = {
      firstName: invitation.candidate.firstName,
      lastName: invitation.candidate.lastName,
      middleName: invitation.candidate.middleName,
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

    await this.invitationRepository.update(invitationId, {
      status: InvitationStatus.REVOKED,
      revokedAt: new Date(),
    });
  }

  async markAsOpened(token: string, ipAddress?: string, userAgent?: string): Promise<void> {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    if (invitation.status === InvitationStatus.PENDING || invitation.status === InvitationStatus.SENT) {
      await this.invitationRepository.update(invitation.id, {
        status: InvitationStatus.OPENED,
        openedAt: new Date(),
        ipAddress,
        userAgent,
      });
    }
  }

  async markAsCompleted(token: string): Promise<void> {
    const invitation = await this.invitationRepository.findOne({
      where: { token },
    });

    if (!invitation) {
      throw new NotFoundException('Приглашение не найдено');
    }

    await this.invitationRepository.update(invitation.id, {
      status: InvitationStatus.COMPLETED,
      completedAt: new Date(),
    });
  }

  private async revokeActiveInvitations(candidateId: string): Promise<void> {
    await this.invitationRepository
      .createQueryBuilder()
      .update(Invitation)
      .set({
        status: InvitationStatus.REVOKED,
        revokedAt: new Date(),
      })
      .where('candidateId = :candidateId', { candidateId })
      .andWhere('status IN (:...statuses)', {
        statuses: [InvitationStatus.PENDING, InvitationStatus.SENT, InvitationStatus.OPENED],
      })
      .execute();
  }

  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  private async sendInvitationEmail(invitation: Invitation): Promise<void> {
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

  private mapToResponseDto(invitation: Invitation): InvitationResponseDto {
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
}
