import {
  Controller,
  Get,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { QuestionnaireService } from './questionnaire.service';
import { UpdateQuestionnaireDto } from './dto/update-questionnaire.dto';
import { QuestionnaireResponseDto } from './dto/questionnaire-response.dto';

@ApiTags('questionnaires')
@Controller('questionnaires')
export class QuestionnaireController {
  constructor(private readonly questionnaireService: QuestionnaireService) {}

  // ==================== Recruiter/Admin Endpoints ====================

  @Get()
  @ApiOperation({ summary: 'Get all questionnaires' })
  @ApiResponse({ status: 200, description: 'List of all questionnaires' })
  async findAll(): Promise<QuestionnaireResponseDto[]> {
    const service = this.questionnaireService as any;
    if (service.findAll) {
      return service.findAll();
    }
    return [];
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get questionnaire by ID' })
  @ApiResponse({ status: 200, description: 'Questionnaire details' })
  @ApiResponse({ status: 404, description: 'Questionnaire not found' })
  async findOne(@Param('id') id: string): Promise<QuestionnaireResponseDto> {
    const service = this.questionnaireService as any;
    if (service.findOne) {
      return service.findOne(id);
    }
    throw new Error('Not implemented');
  }

  // ==================== Public Endpoints (Token-based) ====================

  @Get('token/:token')
  @ApiOperation({ summary: 'Get questionnaire by invitation token' })
  @ApiResponse({ status: 200, description: 'Questionnaire details or empty draft' })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async getByToken(@Param('token') token: string): Promise<QuestionnaireResponseDto> {
    return this.questionnaireService.getOrCreateByToken(token);
  }

  @Post('token/:token')
  @ApiOperation({ summary: 'Update questionnaire (auto-save)' })
  @ApiResponse({ status: 200, description: 'Questionnaire updated' })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async updateByToken(
    @Param('token') token: string,
    @Body() updateDto: UpdateQuestionnaireDto,
  ): Promise<QuestionnaireResponseDto> {
    // Cast service to any to access mock methods
    const service = this.questionnaireService as any;
    if (service.updateByToken) {
      return service.updateByToken(token, updateDto);
    }
    throw new Error('Token validation not implemented in this mode');
  }

  @Post('token/:token/submit')
  @ApiOperation({ summary: 'Submit questionnaire (final step)' })
  @ApiResponse({ status: 200, description: 'Questionnaire submitted successfully' })
  @ApiResponse({ status: 400, description: 'Questionnaire incomplete or already submitted' })
  @ApiResponse({ status: 404, description: 'Invalid or expired token' })
  async submitByToken(@Param('token') token: string): Promise<QuestionnaireResponseDto> {
    // Cast service to any to access mock methods
    const service = this.questionnaireService as any;
    if (service.submitByToken) {
      return service.submitByToken(token);
    }
    throw new Error('Token validation not implemented in this mode');
  }
}
