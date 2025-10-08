import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateInvitationSettingsDto {
  @ApiProperty({ example: 14, description: 'Срок действия приглашений по умолчанию (в днях)', minimum: 1, maximum: 90 })
  @IsNumber()
  @Min(1)
  @Max(90)
  defaultExpiryDays: number;

  @ApiProperty({ example: true, description: 'Автоматически отправлять email при создании приглашения' })
  @IsBoolean()
  autoSendEmail: boolean;

  @ApiProperty({ example: 'Добрый день! Вы приглашены заполнить анкету...', required: false, description: 'Пользовательский шаблон email-приглашения' })
  @IsOptional()
  @IsString()
  emailTemplate?: string | null;
}
