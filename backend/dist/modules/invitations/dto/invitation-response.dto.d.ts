import { InvitationStatus } from '../entities/invitation.entity';
export declare class InvitationResponseDto {
    id: string;
    candidateId: string;
    token: string;
    expiresAt: Date;
    status: InvitationStatus;
    sentAt: Date | null;
    openedAt: Date | null;
    completedAt: Date | null;
    invitationUrl: string;
    candidate: {
        id: string;
        firstName: string;
        lastName: string;
        middleName: string | null;
        email: string;
        phone: string;
        status: string;
    };
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
