import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';

import { Questionnaire } from '../../questionnaire/entities/questionnaire.entity';
import { Invitation } from '../../invitations/entities/invitation.entity';

export enum CandidateStatus {
  DRAFT = 'draft',
  QUESTIONNAIRE_SUBMITTED = 'questionnaire_submitted',
  SECURITY_CHECK_PENDING = 'security_check_pending',
  SECURITY_CHECK_APPROVED = 'security_check_approved',
  SECURITY_CHECK_REJECTED = 'security_check_rejected',
  DOCUMENTS_PENDING = 'documents_pending',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  READY_FOR_1C = 'ready_for_1c',
  TRANSFERRED_TO_1C = 'transferred_to_1c',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: CandidateStatus,
    default: CandidateStatus.DRAFT,
  })
  status: CandidateStatus;

  @Column({ nullable: true })
  invitationToken: string;

  @Column({ nullable: true })
  invitationExpiresAt: Date;

  @Column({ nullable: true })
  documentsToken: string;

  @Column({ nullable: true })
  documentsExpiresAt: Date;

  @Column({ nullable: true })
  securityCheckComment: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @OneToOne(() => Questionnaire, (questionnaire) => questionnaire.candidate)
  questionnaire: Questionnaire;

  @OneToMany(() => Invitation, (invitation) => invitation.candidate)
  invitations: Invitation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual field for full name
  get fullName(): string {
    return [this.firstName, this.middleName, this.lastName]
      .filter(Boolean)
      .join(' ');
  }
}