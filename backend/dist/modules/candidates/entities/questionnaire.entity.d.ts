import { Candidate } from './candidate.entity';
export declare class Questionnaire {
    id: string;
    candidateId: string;
    desiredPosition: string;
    birthDate: Date;
    birthPlace: string;
    previousLastName: string;
    nameChangeDate: Date;
    nameChangeReason: string;
    registrationAddress: string;
    actualAddress: string;
    passportSeries: string;
    passportNumber: string;
    passportIssuedBy: string;
    passportIssueDate: Date;
    passportSubdivisionCode: string;
    inn: string;
    snils: string;
    maritalStatus: string;
    familyMembers: Array<{
        fullName: string;
        birthDate: string;
        workplace: string;
        position: string;
        relationship: string;
    }>;
    education: Array<{
        startDate: string;
        endDate: string;
        institution: string;
        specialization: string;
        type: 'primary' | 'additional';
    }>;
    languages: Array<{
        language: string;
        level: 'none' | 'basic' | 'intermediate' | 'fluent';
    }>;
    workExperience: Array<{
        startDate: string;
        endDate: string;
        company: string;
        position: string;
        reasonForLeaving: string;
        phone: string;
    }>;
    references: Array<{
        fullName: string;
        workplace: string;
        position: string;
        phone: string;
    }>;
    isEntrepreneur: boolean;
    entrepreneurDetails: string;
    drivingLicense: string;
    drivingCategories: string;
    drivingExperience: string;
    medicalDispensary: boolean;
    criminalRecord: boolean;
    criminalDetails: string;
    hasRelativesInCompany: boolean;
    relativesInCompanyDetails: string;
    dataProcessingConsent: boolean;
    backgroundCheckConsent: boolean;
    consentTimestamp: Date;
    consentIpAddress: string;
    consentUserAgent: string;
    isDraft: boolean;
    candidate: Candidate;
    createdAt: Date;
    updatedAt: Date;
}
