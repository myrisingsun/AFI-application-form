import { ApiProperty } from '@nestjs/swagger';
import { InvitationStatus } from '../entities/invitation.entity';

export class InvitationResponseDto {
  @ApiProperty({ description: 'ID приглашения' })
  id: string;

  @ApiProperty({ description: 'ID кандидата' })
  candidateId: string;

  @ApiProperty({ description: 'Токен приглашения' })
  token: string;

  @ApiProperty({ description: 'Дата истечения срока' })
  expiresAt: Date;

  @ApiProperty({ description: 'Статус приглашения', enum: InvitationStatus })
  status: InvitationStatus;

  @ApiProperty({ description: 'Дата отправки', nullable: true })
  sentAt: Date | null;

  @ApiProperty({ description: 'Дата открытия', nullable: true })
  openedAt: Date | null;

  @ApiProperty({ description: 'Дата завершения', nullable: true })
  completedAt: Date | null;

  @ApiProperty({ description: 'URL для доступа к анкете' })
  invitationUrl: string;

  @ApiProperty({ description: 'Данные кандидата' })
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    email: string;
    phone: string;
    status: string;
  };

  @ApiProperty({ description: 'Отправитель приглашения' })
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}