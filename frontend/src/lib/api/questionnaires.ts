import { api } from '../api';
import { Questionnaire } from '@/types/questionnaire';

export const questionnairesApi = {
  // Получить все анкеты (для рекрутеров)
  getAll: async (): Promise<Questionnaire[]> => {
    const response = await api.get('/questionnaires');
    return response.data;
  },

  // Получить анкету по ID
  getById: async (id: string): Promise<Questionnaire> => {
    const response = await api.get(`/questionnaires/${id}`);
    return response.data;
  },

  // Скачать PDF анкеты
  downloadPdf: async (id: string): Promise<Blob> => {
    const response = await api.get(`/questionnaires/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
