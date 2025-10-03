export interface InvitationEmailData {
    candidateFirstName: string;
    candidateLastName: string;
    candidateEmail: string;
    invitationUrl: string;
    expiryDate: string;
    recruiterName: string;
    recruiterEmail: string;
}
export declare class EmailService {
    private readonly logger;
    private transporter;
    constructor();
    sendInvitationEmail(data: InvitationEmailData): Promise<void>;
    private loadTemplate;
    testConnection(): Promise<boolean>;
}
