export enum InvitationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  OPENED = 'opened',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

export interface CreateInvitationDto {
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
}

export interface InvitationResponse {
  id: string;
  candidateId: string;
  token: string;
  expiresAt: string;
  status: InvitationStatus;
  sentAt: string | null;
  openedAt: string | null;
  completedAt: string | null;
  invitationUrl: string;
  candidate: {
    id: string;
    firstName: string;
    lastName: string;
    middleName: string | null;
    email: string;
    phone: string;
    status: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export const InvitationStatusLabels: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: 'В ожидании',
  [InvitationStatus.SENT]: 'Отправлено',
  [InvitationStatus.OPENED]: 'Открыто',
  [InvitationStatus.COMPLETED]: 'Завершено',
  [InvitationStatus.EXPIRED]: 'Истекло',
  [InvitationStatus.REVOKED]: 'Отозвано',
};

export const InvitationStatusColors: Record<InvitationStatus, string> = {
  [InvitationStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [InvitationStatus.SENT]: 'bg-blue-100 text-blue-800',
  [InvitationStatus.OPENED]: 'bg-purple-100 text-purple-800',
  [InvitationStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [InvitationStatus.EXPIRED]: 'bg-red-100 text-red-800',
  [InvitationStatus.REVOKED]: 'bg-gray-100 text-gray-800',
};