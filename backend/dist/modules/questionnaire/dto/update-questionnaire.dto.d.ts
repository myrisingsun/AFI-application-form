export declare class EducationDto {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
    current: boolean;
}
export declare class WorkExperienceDto {
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    responsibilities: string;
}
export declare class ConsentsDto {
    pdnConsent: boolean;
    photoConsent: boolean;
    backgroundCheckConsent: boolean;
    medicalCheckConsent: boolean;
}
export declare class UpdateQuestionnaireDto {
    passportSeries?: string;
    passportNumber?: string;
    passportIssuer?: string;
    passportIssueDate?: string;
    passportIssuerCode?: string;
    birthDate?: string;
    birthPlace?: string;
    registrationAddress?: string;
    actualAddress?: string;
    actualAddressSameAsRegistration?: boolean;
    education?: EducationDto[];
    workExperience?: WorkExperienceDto[];
    consents?: ConsentsDto;
}
