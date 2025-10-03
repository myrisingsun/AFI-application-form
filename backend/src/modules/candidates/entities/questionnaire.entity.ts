import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Candidate } from './candidate.entity';

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  candidateId: string;

  // General Information
  @Column()
  desiredPosition: string;

  @Column()
  birthDate: Date;

  @Column()
  birthPlace: string;

  @Column({ nullable: true })
  previousLastName: string;

  @Column({ nullable: true })
  nameChangeDate: Date;

  @Column({ nullable: true })
  nameChangeReason: string;

  // Addresses
  @Column()
  registrationAddress: string;

  @Column({ nullable: true })
  actualAddress: string;

  // Documents
  @Column()
  passportSeries: string;

  @Column()
  passportNumber: string;

  @Column()
  passportIssuedBy: string;

  @Column()
  passportIssueDate: Date;

  @Column()
  passportSubdivisionCode: string;

  @Column()
  inn: string;

  @Column()
  snils: string;

  // Family
  @Column()
  maritalStatus: string;

  @Column({ type: 'jsonb', nullable: true })
  familyMembers: Array<{
    fullName: string;
    birthDate: string;
    workplace: string;
    position: string;
    relationship: string;
  }>;

  // Education
  @Column({ type: 'jsonb' })
  education: Array<{
    startDate: string;
    endDate: string;
    institution: string;
    specialization: string;
    type: 'primary' | 'additional';
  }>;

  // Languages
  @Column({ type: 'jsonb', nullable: true })
  languages: Array<{
    language: string;
    level: 'none' | 'basic' | 'intermediate' | 'fluent';
  }>;

  // Work Experience (last 10 years)
  @Column({ type: 'jsonb' })
  workExperience: Array<{
    startDate: string;
    endDate: string;
    company: string;
    position: string;
    reasonForLeaving: string;
    phone: string;
  }>;

  // References
  @Column({ type: 'jsonb' })
  references: Array<{
    fullName: string;
    workplace: string;
    position: string;
    phone: string;
  }>;

  // Additional Information
  @Column({ default: false })
  isEntrepreneur: boolean;

  @Column({ nullable: true })
  entrepreneurDetails: string;

  @Column({ nullable: true })
  drivingLicense: string;

  @Column({ nullable: true })
  drivingCategories: string;

  @Column({ nullable: true })
  drivingExperience: string;

  @Column({ default: false })
  medicalDispensary: boolean;

  @Column({ default: false })
  criminalRecord: boolean;

  @Column({ nullable: true })
  criminalDetails: string;

  @Column({ default: false })
  hasRelativesInCompany: boolean;

  @Column({ nullable: true })
  relativesInCompanyDetails: string;

  // Consents
  @Column({ default: false })
  dataProcessingConsent: boolean;

  @Column({ default: false })
  backgroundCheckConsent: boolean;

  @Column({ nullable: true })
  consentTimestamp: Date;

  @Column({ nullable: true })
  consentIpAddress: string;

  @Column({ nullable: true })
  consentUserAgent: string;

  @Column({ default: false })
  isDraft: boolean;

  @OneToOne(() => Candidate, (candidate) => candidate.questionnaire)
  @JoinColumn()
  candidate: Candidate;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}