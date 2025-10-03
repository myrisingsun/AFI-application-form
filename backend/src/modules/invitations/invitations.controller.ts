import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { InvitationsService } from './invitations.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/modules/auth/entities/user.entity';

@ApiTags('invitations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('invitations')
export class InvitationsController {
  constructor(private readonly invitationsService: InvitationsService) {}

  @ApiOperation({ summary: 'Get all invitations' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Get()
  findAll() {
    return this.invitationsService.findAll();
  }

  @ApiOperation({ summary: 'Get invitation by ID' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invitationsService.findOne(id);
  }

  @ApiOperation({ summary: 'Create new invitation' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Post()
  create(@Body() createData: any) {
    return this.invitationsService.create(createData);
  }
}
