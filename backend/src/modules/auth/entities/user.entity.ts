import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.RECRUITER,
  })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
    default: () => `'{
      "emailOnQuestionnaireSubmitted": true,
      "emailOnDocumentsUploaded": true,
      "emailOnInvitationExpiring": true,
      "expiringInvitationDays": 3,
      "digestFrequency": "none"
    }'`,
  })
  notificationSettings: {
    emailOnQuestionnaireSubmitted: boolean;
    emailOnDocumentsUploaded: boolean;
    emailOnInvitationExpiring: boolean;
    expiringInvitationDays: number;
    digestFrequency: 'none' | 'daily' | 'weekly';
  };

  @Column({
    type: 'jsonb',
    nullable: true,
    default: () => `'{
      "defaultExpiryDays": 14,
      "autoSendEmail": true,
      "emailTemplate": null
    }'`,
  })
  invitationSettings: {
    defaultExpiryDays: number;
    autoSendEmail: boolean;
    emailTemplate: string | null;
  };

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual field for full name
  get fullName(): string {
    const parts = [this.lastName, this.firstName, this.middleName].filter(Boolean);
    return parts.join(' ');
  }
}