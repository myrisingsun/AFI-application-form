import { QuestionnaireStatus, Education, WorkExperience, Consents } from '../entities/questionnaire.entity';

export class QuestionnaireResponseDto {
  id: string;
  candidateId: string;
  status: QuestionnaireStatus;

  // Candidate contact info (from Step 1)
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
  passportIssueDate?: Date;
  passportIssuerCode?: string;
  birthDate?: Date;
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

  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
}
