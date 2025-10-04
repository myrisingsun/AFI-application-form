import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Patch,
  Delete,
  Req,
  HttpCode,
  HttpStatus,
  Headers,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { InvitationsService } from './invitations.service';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { UpdateInvitationStatusDto } from './dto/update-invitation.dto';
import { InvitationResponseDto } from './dto/invitation-response.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/modules/auth/entities/user.entity';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @ApiOperation({ summary: 'Получить все приглашения' })
  @ApiResponse({ type: [InvitationResponseDto] })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Get()
  async findAll(): Promise<InvitationResponseDto[]> {
    return this.invitationsService.findAll();
  }

  @ApiOperation({ summary: 'Получить приглашение по ID' })
  @ApiResponse({ type: InvitationResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InvitationResponseDto> {
    return this.invitationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Создать новое приглашение' })
  @ApiBody({ type: CreateInvitationDto })
  @ApiResponse({ type: InvitationResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Post()
  async create(
    @Body() createInvitationDto: CreateInvitationDto,
    @CurrentUser() user: any,
  ): Promise<InvitationResponseDto> {
    return this.invitationsService.createInvitation(createInvitationDto, user.id);
  }

  @ApiOperation({ summary: 'Повторно отправить приглашение' })
  @ApiResponse({ type: InvitationResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Post(':id/resend')
  async resend(
    @Param('id') id: string,
    @CurrentUser() user: any,
  ): Promise<InvitationResponseDto> {
    return this.invitationsService.resendInvitation(id, user.id);
  }

  @ApiOperation({ summary: 'Изменить статус приглашения' })
  @ApiBody({ type: UpdateInvitationStatusDto })
  @ApiResponse({ type: InvitationResponseDto })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateInvitationStatusDto,
  ): Promise<InvitationResponseDto> {
    return this.invitationsService.updateStatus(id, updateStatusDto.status);
  }

  @ApiOperation({ summary: 'Отозвать приглашение' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async revoke(@Param('id') id: string): Promise<void> {
    return this.invitationsService.revokeInvitation(id);
  }

  // Публичные эндпоинты для кандидатов (без аутентификации)
  @ApiOperation({ summary: 'Получить приглашение по токену (для кандидата)' })
  @ApiResponse({ type: InvitationResponseDto })
  @Get('public/token/:token')
  async findByToken(@Param('token') token: string): Promise<InvitationResponseDto> {
    return this.invitationsService.findByToken(token);
  }

  @ApiOperation({ summary: 'Отметить приглашение как открытое' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('public/token/:token/open')
  async markAsOpened(
    @Param('token') token: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<void> {
    return this.invitationsService.markAsOpened(token, ip, userAgent);
  }

  @ApiOperation({ summary: 'Отметить приглашение как завершённое' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('public/token/:token/complete')
  async markAsCompleted(@Param('token') token: string): Promise<void> {
    return this.invitationsService.markAsCompleted(token);
  }
}
