import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { EmailService } from '@/modules/email/email.service';
export declare class InvitationsMockService {
    private emailService;
    constructor(emailService: EmailService);
    findAll(): Promise<InvitationResponseDto[]>;
    findOne(id: string): Promise<InvitationResponseDto>;
    findByToken(token: string): Promise<InvitationResponseDto>;
    createInvitation(createInvitationDto: CreateInvitationDto, userId: string): Promise<InvitationResponseDto>;
    resendInvitation(invitationId: string, userId: string): Promise<InvitationResponseDto>;
    revokeInvitation(invitationId: string): Promise<void>;
    markAsOpened(token: string, ipAddress?: string, userAgent?: string): Promise<void>;
    markAsCompleted(token: string): Promise<void>;
    private generateId;
    private generateToken;
}
