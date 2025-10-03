import { Candidate } from '@/modules/candidates/entities/candidate.entity';
import { User } from '@/modules/auth/entities/user.entity';
export declare enum InvitationStatus {
    PENDING = "pending",
    SENT = "sent",
    OPENED = "opened",
    COMPLETED = "completed",
    EXPIRED = "expired",
    REVOKED = "revoked"
}
export declare class Invitation {
    id: string;
    candidateId: string;
    createdById: string;
    token: string;
    expiresAt: Date;
    status: InvitationStatus;
    sentAt: Date;
    openedAt: Date;
    completedAt: Date;
    revokedAt: Date;
    ipAddress: string;
    userAgent: string;
    candidate: Candidate;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
}
