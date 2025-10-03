import axios from 'axios';
import { Questionnaire, QuestionnaireFormData } from '@/types/questionnaire';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const questionnaireApi = {
  // Get questionnaire by token
  getByToken: async (token: string): Promise<Questionnaire> => {
    const response = await axios.get(`${API_URL}/questionnaires/token/${token}`);
    return response.data;
  },

  // Update questionnaire (auto-save)
  updateByToken: async (
    token: string,
    data: Partial<QuestionnaireFormData>,
  ): Promise<Questionnaire> => {
    const response = await axios.post(`${API_URL}/questionnaires/token/${token}`, data);
    return response.data;
  },

  // Submit questionnaire
  submitByToken: async (token: string): Promise<Questionnaire> => {
    const response = await axios.post(`${API_URL}/questionnaires/token/${token}/submit`);
    return response.data;
  },

  // For recruiters: Get all questionnaires
  getAll: async (): Promise<Questionnaire[]> => {
    const response = await axios.get(`${API_URL}/questionnaires`);
    return response.data;
  },

  // For recruiters: Get questionnaire by ID
  getById: async (id: string): Promise<Questionnaire> => {
    const response = await axios.get(`${API_URL}/questionnaires/${id}`);
    return response.data;
  },
};
