import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { CandidatesService } from './candidates.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/common/guards/roles.guard';
import { Roles } from '@/common/decorators/roles.decorator';
import { UserRole } from '@/modules/auth/entities/user.entity';

@ApiTags('candidates')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('candidates')
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @ApiOperation({ summary: 'Get all candidates' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.SECURITY)
  @Get()
  findAll() {
    return this.candidatesService.findAll();
  }

  @ApiOperation({ summary: 'Get candidate by ID' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER, UserRole.SECURITY)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.candidatesService.findOne(id);
  }

  @ApiOperation({ summary: 'Update candidate' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.candidatesService.update(id, updateData);
  }

  @ApiOperation({ summary: 'Delete candidate' })
  @Roles(UserRole.ADMIN, UserRole.RECRUITER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(id);
  }
}