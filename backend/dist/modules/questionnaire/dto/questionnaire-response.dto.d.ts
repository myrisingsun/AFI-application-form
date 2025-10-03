import { QuestionnaireStatus, Education, WorkExperience, Consents } from '../entities/questionnaire.entity';
export declare class QuestionnaireResponseDto {
    id: string;
    candidateId: string;
    status: QuestionnaireStatus;
    candidate?: {
        id: string;
        firstName: string;
        lastName: string;
        middleName?: string;
        email: string;
        phone: string;
    };
    passportSeries?: string;
    passportNumber?: string;
    passportIssuer?: string;
    passportIssueDate?: Date;
    passportIssuerCode?: string;
    birthDate?: Date;
    birthPlace?: string;
    registrationAddress?: string;
    actualAddress?: string;
    actualAddressSameAsRegistration: boolean;
    education?: Education[];
    workExperience?: WorkExperience[];
    consents?: Consents;
    createdAt: Date;
    updatedAt: Date;
    submittedAt?: Date;
}
