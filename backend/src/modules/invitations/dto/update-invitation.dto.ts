import { IsEnum } from 'class-validator';
import { InvitationStatus } from '../entities/invitation.entity';

export class UpdateInvitationStatusDto {
  @IsEnum(InvitationStatus)
  status: InvitationStatus;
}
