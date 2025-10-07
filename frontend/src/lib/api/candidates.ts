import { api } from '../api';
import { CandidateResponse } from '@/types/candidate';

export const candidatesApi = {
  // Получить всех кандидатов
  getAll: async (): Promise<CandidateResponse[]> => {
    const response = await api.get('/candidates');
    return response.data;
  },

  // Получить кандидата по ID
  getById: async (id: string): Promise<CandidateResponse> => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },

  // Удалить кандидата (каскадно удаляет анкету и приглашения)
  delete: async (id: string): Promise<void> => {
    await api.delete(`/candidates/${id}`);
  },
};
