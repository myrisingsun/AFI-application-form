import { Questionnaire } from './questionnaire.entity';
export declare enum CandidateStatus {
    DRAFT = "draft",
    QUESTIONNAIRE_SUBMITTED = "questionnaire_submitted",
    SECURITY_CHECK_PENDING = "security_check_pending",
    SECURITY_CHECK_APPROVED = "security_check_approved",
    SECURITY_CHECK_REJECTED = "security_check_rejected",
    DOCUMENTS_PENDING = "documents_pending",
    DOCUMENTS_UPLOADED = "documents_uploaded",
    READY_FOR_1C = "ready_for_1c",
    TRANSFERRED_TO_1C = "transferred_to_1c",
    COMPLETED = "completed",
    REJECTED = "rejected"
}
export declare class Candidate {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    status: CandidateStatus;
    invitationToken: string;
    invitationExpiresAt: Date;
    documentsToken: string;
    documentsExpiresAt: Date;
    securityCheckComment: string;
    metadata: Record<string, any>;
    questionnaire: Questionnaire;
    createdAt: Date;
    updatedAt: Date;
    get fullName(): string;
}
