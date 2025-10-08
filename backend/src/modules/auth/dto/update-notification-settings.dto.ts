import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsEnum, Min, Max } from 'class-validator';

export enum DigestFrequency {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
}

export class UpdateNotificationSettingsDto {
  @ApiProperty({ example: true, description: 'Получать email о новых заполненных анкетах' })
  @IsBoolean()
  emailOnQuestionnaireSubmitted: boolean;

  @ApiProperty({ example: true, description: 'Получать email о загруженных документах' })
  @IsBoolean()
  emailOnDocumentsUploaded: boolean;

  @ApiProperty({ example: true, description: 'Уведомления об истекающих приглашениях' })
  @IsBoolean()
  emailOnInvitationExpiring: boolean;

  @ApiProperty({ example: 3, description: 'За сколько дней уведомлять об истечении приглашения', minimum: 1, maximum: 30 })
  @IsNumber()
  @Min(1)
  @Max(30)
  expiringInvitationDays: number;

  @ApiProperty({ enum: DigestFrequency, example: DigestFrequency.NONE, description: 'Частота дайджеста' })
  @IsEnum(DigestFrequency)
  digestFrequency: DigestFrequency;
}
