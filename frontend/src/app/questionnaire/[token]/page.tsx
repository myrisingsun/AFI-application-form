'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { QuestionnaireWizard } from '@/components/questionnaire/QuestionnaireWizard';
import { questionnaireApi } from '@/lib/api/questionnaire';
import { Questionnaire } from '@/types/questionnaire';

export default function QuestionnairePage() {
  const params = useParams();
  const token = params.token as string;
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQuestionnaire = async () => {
      try {
        const data = await questionnaireApi.getByToken(token);
        setQuestionnaire(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load questionnaire');
      } finally {
        setLoading(false);
      }
    };

    loadQuestionnaire();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Загрузка анкеты...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Ошибка</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <QuestionnaireWizard token={token} initialData={questionnaire} />
      </div>
    </div>
  );
}
