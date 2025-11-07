import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  Matches,
  ValidateNested,
  IsObject,
  IsEmail,
  IsEnum,
  MaxDate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaritalStatus } from '../entities/questionnaire.entity';

export class EducationDto {
  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsString()
  fieldOfStudy: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsBoolean()
  current: boolean;
}

export class WorkExperienceDto {
  @IsString()
  company: string;

  @IsString()
  position: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;

  @IsBoolean()
  current: boolean;

  @IsString()
  responsibilities: string;
}

export class AddressDto {
  @IsString()
  postalCode: string; // Индекс

  @IsString()
  city: string; // Город

  @IsString()
  street: string; // Улица

  @IsString()
  house: string; // Дом

  @IsOptional()
  @IsString()
  building?: string; // Корпус

  @IsOptional()
  @IsString()
  apartment?: string; // Квартира
}

export class ForeignPassportDto {
  @IsOptional()
  @IsString()
  series?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  issuer?: string;

  @IsOptional()
  @IsDateString()
  issueDate?: string;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;
}

export class FamilyMemberDto {
  @IsString()
  relationship: string; // Степень родства

  @IsString()
  fullName: string; // ФИО

  @IsString()
  contactInfo: string; // Контактная информация

  @IsString()
  workplace: string; // Место работы

  @IsString()
  position: string; // Должность
}

export class ReferenceDto {
  @IsString()
  fullName: string; // ФИО лица

  @IsString()
  position: string; // Должность

  @IsString()
  workplace: string; // Место работы

  @IsString()
  phone: string; // Контактная информация
}

export class ConsentsDto {
  @IsBoolean()
  pdnConsent: boolean;

  @IsBoolean()
  photoConsent: boolean;

  @IsBoolean()
  backgroundCheckConsent: boolean;

  @IsBoolean()
  medicalCheckConsent: boolean;
}

export class EntrepreneurInfoDto {
  @IsBoolean()
  isEntrepreneur: boolean;

  @IsOptional()
  @IsString()
  details?: string;
}

export class DriverLicenseDto {
  @IsBoolean()
  hasLicense: boolean;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  experienceYears?: string;
}

export class CriminalRecordDto {
  @IsBoolean()
  hasCriminalRecord: boolean;

  @IsOptional()
  @IsString()
  details?: string;
}

export class RelativesInCompanyDto {
  @IsBoolean()
  hasRelativesInCompany: boolean;

  @IsOptional()
  @IsString()
  details?: string;
}

export class UpdateQuestionnaireDto {
  // Step 1: Contact Information (including candidate fields)
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  middleName?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  additionalContact?: string; // Дополнительный контакт

  // Step 2: Passport Data
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}$/, { message: 'Passport series must be 4 digits' })
  passportSeries?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{6}$/, { message: 'Passport number must be 6 digits' })
  passportNumber?: string;

  @IsOptional()
  @IsString()
  passportIssuer?: string;

  @IsOptional()
  @IsDateString()
  passportIssueDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}-\d{3}$/, { message: 'Issuer code must be in format XXX-XXX' })
  passportIssuerCode?: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  birthPlace?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{12}$/, { message: 'ИНН must be 12 digits' })
  inn?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}-\d{3}-\d{3} \d{2}$/, { message: 'СНИЛС must be in format XXX-XXX-XXX XX' })
  snils?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ForeignPassportDto)
  foreignPassport?: ForeignPassportDto;

  // Step 3: Address
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  registrationAddress?: AddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDto)
  actualAddress?: AddressDto;

  @IsOptional()
  @IsBoolean()
  actualAddressSameAsRegistration?: boolean;

  // Step 4: Education & Experience
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  workExperience?: WorkExperienceDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReferenceDto)
  references?: ReferenceDto[];

  // Step 5: Family Status (Семейное положение)
  @IsOptional()
  @IsEnum(MaritalStatus)
  maritalStatus?: MaritalStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FamilyMemberDto)
  familyMembers?: FamilyMemberDto[];

  // Step 6: Consents
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ConsentsDto)
  consents?: ConsentsDto;

  // Step 7: Additional Information (Sprint 7)
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => EntrepreneurInfoDto)
  entrepreneurInfo?: EntrepreneurInfoDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DriverLicenseDto)
  driverLicense?: DriverLicenseDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CriminalRecordDto)
  criminalRecord?: CriminalRecordDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => RelativesInCompanyDto)
  relativesInCompany?: RelativesInCompanyDto;
}
