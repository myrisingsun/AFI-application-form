import { Repository } from 'typeorm';
import { Invitation } from './entities/invitation.entity';
import { Candidate } from '@/modules/candidates/entities/candidate.entity';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from '@/modules/email/email.service';
export declare class InvitationsService {
    private invitationRepository;
    private candidateRepository;
    private emailService;
    constructor(invitationRepository: Repository<Invitation>, candidateRepository: Repository<Candidate>, emailService: EmailService);
    findAll(): Promise<InvitationResponseDto[]>;
    findOne(id: string): Promise<InvitationResponseDto>;
    findByToken(token: string): Promise<InvitationResponseDto>;
    createInvitation(createInvitationDto: CreateInvitationDto, userId: string): Promise<InvitationResponseDto>;
    resendInvitation(invitationId: string, userId: string): Promise<InvitationResponseDto>;
    revokeInvitation(invitationId: string): Promise<void>;
    markAsOpened(token: string, ipAddress?: string, userAgent?: string): Promise<void>;
    markAsCompleted(token: string): Promise<void>;
    private revokeActiveInvitations;
    private generateToken;
    private sendInvitationEmail;
    private mapToResponseDto;
}
