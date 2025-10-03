import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Candidate } from '@/modules/candidates/entities/candidate.entity';
import { User } from '@/modules/auth/entities/user.entity';

export enum InvitationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  OPENED = 'opened',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  candidateId: string;

  @Column('uuid')
  createdById: string;

  @Column()
  token: string;

  @Column()
  expiresAt: Date;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @Column({ nullable: true })
  sentAt: Date;

  @Column({ nullable: true })
  openedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column({ nullable: true })
  revokedAt: Date;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  userAgent: string;

  @ManyToOne(() => Candidate, { onDelete: 'CASCADE' })
  @JoinColumn()
  candidate: Candidate;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  createdBy: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
