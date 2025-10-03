import { Candidate } from '@/modules/candidates/entities/candidate.entity';
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
    createdAt: Date;
    updatedAt: Date;
}
