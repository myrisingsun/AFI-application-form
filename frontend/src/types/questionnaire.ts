export enum QuestionnaireStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  responsibilities: string;
}

export interface Consents {
  pdnConsent: boolean;
  photoConsent: boolean;
  backgroundCheckConsent: boolean;
  medicalCheckConsent: boolean;
}

export interface Questionnaire {
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

  // Step 2: Passport Data
  passportSeries?: string;
  passportNumber?: string;
  passportIssuer?: string;
  passportIssueDate?: string;
  passportIssuerCode?: string;
  birthDate?: string;
  birthPlace?: string;

  // Step 3: Address
  registrationAddress?: string;
  actualAddress?: string;
  actualAddressSameAsRegistration: boolean;

  // Step 4: Education & Experience
  education?: Education[];
  workExperience?: WorkExperience[];

  // Step 5: Consents
  consents?: Consents;

  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

export interface QuestionnaireFormData {
  // Step 2: Passport
  passportSeries: string;
  passportNumber: string;
  passportIssuer: string;
  passportIssueDate: string;
  passportIssuerCode: string;
  birthDate: string;
  birthPlace: string;

  // Step 3: Address
  registrationAddress: string;
  actualAddress: string;
  actualAddressSameAsRegistration: boolean;

  // Step 4: Education & Experience
  education: Education[];
  workExperience: WorkExperience[];

  // Step 5: Consents
  consents: Consents;
}
