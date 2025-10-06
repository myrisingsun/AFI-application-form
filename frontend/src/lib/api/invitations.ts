import { api } from '../api';
import { CreateInvitationDto, InvitationResponse } from '@/types/invitation';

export const invitationsApi = {
  // Получить все приглашения
  getAll: async (): Promise<InvitationResponse[]> => {
    const response = await api.get('/invitations');
    return response.data;
  },

  // Получить приглашение по ID
  getById: async (id: string): Promise<InvitationResponse> => {
    const response = await api.get(`/invitations/${id}`);
    return response.data;
  },

  // Создать новое приглашение
  create: async (data: CreateInvitationDto): Promise<InvitationResponse> => {
    const response = await api.post('/invitations', data);
    return response.data;
  },

  // Повторно отправить приглашение
  resend: async (id: string): Promise<InvitationResponse> => {
    const response = await api.post(`/invitations/${id}/resend`);
    return response.data;
  },

  // Изменить статус приглашения
  updateStatus: async (id: string, status: string): Promise<InvitationResponse> => {
    const response = await api.patch(`/invitations/${id}/status`, { status });
    return response.data;
  },

  // Отозвать приглашение
  revoke: async (id: string): Promise<void> => {
    await api.delete(`/invitations/${id}/revoke`);
  },

  // Удалить приглашение полностью
  delete: async (id: string): Promise<void> => {
    await api.delete(`/invitations/${id}`);
  },

  // Публичные методы для кандидатов
  getByToken: async (token: string): Promise<InvitationResponse> => {
    const response = await api.get(`/invitations/public/token/${token}`);
    return response.data;
  },

  markAsOpened: async (token: string): Promise<void> => {
    await api.post(`/invitations/public/token/${token}/open`);
  },

  markAsCompleted: async (token: string): Promise<void> => {
    await api.post(`/invitations/public/token/${token}/complete`);
  },
};