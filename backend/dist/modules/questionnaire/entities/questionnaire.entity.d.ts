import { Candidate } from '../../candidates/entities/candidate.entity';
export declare enum QuestionnaireStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted"
}
export interface Education {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
}
export interface WorkExperience {
    company: string;
    position: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    responsibilities: string;
}
export interface Consents {
    pdnConsent: boolean;
    photoConsent: boolean;
    backgroundCheckConsent: boolean;
    medicalCheckConsent: boolean;
}
export declare class Questionnaire {
    id: string;
    candidateId: string;
    candidate: Candidate;
    status: QuestionnaireStatus;
    passportSeries: string;
    passportNumber: string;
    passportIssuer: string;
    passportIssueDate: Date;
    passportIssuerCode: string;
    birthDate: Date;
    birthPlace: string;
    registrationAddress: string;
    actualAddress: string;
    actualAddressSameAsRegistration: boolean;
    education: Education[];
    workExperience: WorkExperience[];
    consents: Consents;
    createdAt: Date;
    updatedAt: Date;
    submittedAt: Date;
}
