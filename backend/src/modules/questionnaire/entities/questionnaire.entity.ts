import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Candidate } from '../../candidates/entities/candidate.entity';

export enum QuestionnaireStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
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

@Entity('questionnaires')
export class Questionnaire {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  candidateId: string;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn()
  candidate: Candidate;

  @Column({
    type: 'enum',
    enum: QuestionnaireStatus,
    default: QuestionnaireStatus.DRAFT,
  })
  status: QuestionnaireStatus;

  // Step 2: Passport Data
  @Column({ type: 'varchar', length: 4, nullable: true })
  passportSeries: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  passportNumber: string;

  @Column({ type: 'varchar', nullable: true })
  passportIssuer: string;

  @Column({ type: 'date', nullable: true })
  passportIssueDate: Date;

  @Column({ type: 'varchar', length: 7, nullable: true }) // XXX-XXX format
  passportIssuerCode: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({ type: 'varchar', nullable: true })
  birthPlace: string;

  // Step 3: Address
  @Column({ type: 'text', nullable: true })
  registrationAddress: string;

  @Column({ type: 'text', nullable: true })
  actualAddress: string;

  @Column({ type: 'boolean', default: false })
  actualAddressSameAsRegistration: boolean;

  // Step 4: Education & Experience
  @Column({ type: 'jsonb', nullable: true })
  education: Education[];

  @Column({ type: 'jsonb', nullable: true })
  workExperience: WorkExperience[];

  // Step 5: Consents
  @Column({ type: 'jsonb', nullable: true })
  consents: Consents;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt: Date;
}
