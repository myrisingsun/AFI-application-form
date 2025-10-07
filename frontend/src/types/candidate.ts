export enum CandidateStatus {
  DRAFT = 'draft',
  QUESTIONNAIRE_SUBMITTED = 'questionnaire_submitted',
  SECURITY_CHECK_PENDING = 'security_check_pending',
  SECURITY_CHECK_APPROVED = 'security_check_approved',
  SECURITY_CHECK_REJECTED = 'security_check_rejected',
  DOCUMENTS_PENDING = 'documents_pending',
  DOCUMENTS_UPLOADED = 'documents_uploaded',
  READY_FOR_1C = 'ready_for_1c',
  TRANSFERRED_TO_1C = 'transferred_to_1c',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

export const CandidateStatusLabels: Record<CandidateStatus, string> = {
  [CandidateStatus.DRAFT]: 'Черновик',
  [CandidateStatus.QUESTIONNAIRE_SUBMITTED]: 'Анкета заполнена',
  [CandidateStatus.SECURITY_CHECK_PENDING]: 'Ожидает проверки СБ',
  [CandidateStatus.SECURITY_CHECK_APPROVED]: 'СБ одобрено',
  [CandidateStatus.SECURITY_CHECK_REJECTED]: 'СБ отклонено',
  [CandidateStatus.DOCUMENTS_PENDING]: 'Ожидает документы',
  [CandidateStatus.DOCUMENTS_UPLOADED]: 'Документы загружены',
  [CandidateStatus.READY_FOR_1C]: 'Готов для 1С',
  [CandidateStatus.TRANSFERRED_TO_1C]: 'Передан в 1С',
  [CandidateStatus.COMPLETED]: 'Завершено',
  [CandidateStatus.REJECTED]: 'Отклонено',
};

export const CandidateStatusColors: Record<CandidateStatus, string> = {
  [CandidateStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [CandidateStatus.QUESTIONNAIRE_SUBMITTED]: 'bg-blue-100 text-blue-800',
  [CandidateStatus.SECURITY_CHECK_PENDING]: 'bg-yellow-100 text-yellow-800',
  [CandidateStatus.SECURITY_CHECK_APPROVED]: 'bg-green-100 text-green-800',
  [CandidateStatus.SECURITY_CHECK_REJECTED]: 'bg-red-100 text-red-800',
  [CandidateStatus.DOCUMENTS_PENDING]: 'bg-orange-100 text-orange-800',
  [CandidateStatus.DOCUMENTS_UPLOADED]: 'bg-purple-100 text-purple-800',
  [CandidateStatus.READY_FOR_1C]: 'bg-indigo-100 text-indigo-800',
  [CandidateStatus.TRANSFERRED_TO_1C]: 'bg-teal-100 text-teal-800',
  [CandidateStatus.COMPLETED]: 'bg-green-100 text-green-800',
  [CandidateStatus.REJECTED]: 'bg-red-100 text-red-800',
};

export interface QuestionnaireInfo {
  id: string;
  status: 'draft' | 'submitted';
  submittedAt?: string;
}

export interface InvitationInfo {
  id: string;
  token: string;
  status: string;
  expiresAt: string;
  createdAt: string;
}

export interface CandidateResponse {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  questionnaire?: QuestionnaireInfo;
  invitations?: InvitationInfo[];
  createdAt: string;
  updatedAt: string;
}
