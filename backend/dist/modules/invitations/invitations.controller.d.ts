import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    findAll(): Promise<InvitationResponseDto[]>;
    findOne(id: string): Promise<InvitationResponseDto>;
    create(createInvitationDto: CreateInvitationDto, user: any): Promise<InvitationResponseDto>;
    resend(id: string, user: any): Promise<InvitationResponseDto>;
    revoke(id: string): Promise<void>;
    findByToken(token: string): Promise<InvitationResponseDto>;
    markAsOpened(token: string, ip: string, userAgent: string): Promise<void>;
    markAsCompleted(token: string): Promise<void>;
}
