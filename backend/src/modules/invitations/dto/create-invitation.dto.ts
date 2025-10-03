import { IsString, IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvitationDto {
  @ApiProperty({ description: 'Имя кандидата' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Фамилия кандидата' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'Отчество кандидата', required: false })
  @IsOptional()
  @IsString()
  middleName?: string;

  @ApiProperty({ description: 'Email кандидата' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Телефон кандидата' })
  @IsString()
  phone: string;
}