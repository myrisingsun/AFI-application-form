import { QuestionnaireStatus, Education, WorkExperience, Consents, Address, FamilyMember, MaritalStatus, ForeignPassport } from '../entities/questionnaire.entity';

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

  // Step 1: Contact Information
  email?: string;
  additionalContact?: string;

  // Step 2: Passport Data
  passportSeries?: string;
  passportNumber?: string;
  passportIssuer?: string;
  passportIssueDate?: Date;
  passportIssuerCode?: string;
  birthDate?: Date;
  birthPlace?: string;
  inn?: string;
  snils?: string;
  foreignPassport?: ForeignPassport;

  // Step 3: Address
  registrationAddress?: Address;
  actualAddress?: Address;
  actualAddressSameAsRegistration: boolean;

  // Step 4: Education & Experience
  education?: Education[];
  workExperience?: WorkExperience[];

  // Step 5: Family Status
  maritalStatus?: MaritalStatus;
  familyMembers?: FamilyMember[];

  // Step 6: Consents
  consents?: Consents;

  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;

  // Invitation token
  invitationToken?: string;
}
