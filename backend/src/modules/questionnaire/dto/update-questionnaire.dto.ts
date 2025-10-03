import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  Matches,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  endDate?: string;

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
  endDate?: string;

  @IsBoolean()
  current: boolean;

  @IsString()
  responsibilities: string;
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

export class UpdateQuestionnaireDto {
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

  // Step 3: Address
  @IsOptional()
  @IsString()
  registrationAddress?: string;

  @IsOptional()
  @IsString()
  actualAddress?: string;

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

  // Step 5: Consents
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ConsentsDto)
  consents?: ConsentsDto;
}
