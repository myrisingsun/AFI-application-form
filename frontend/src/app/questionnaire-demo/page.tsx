'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function QuestionnaireDemoPage() {
  const [token, setToken] = useState('demo-token-123');
  const router = useRouter();

  const handleStart = () => {
    router.push(`/questionnaire/${token}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Демо: Анкета кандидата
        </h1>
        <p className="text-gray-600 mb-6">
          Протестируйте многошаговую форму анкетирования
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Токен приглашения (demo)
            </label>
            <Input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Введите токен"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Любой токен создаст новую анкету для тестирования
            </p>
          </div>

          <Button onClick={handleStart} className="w-full" size="lg">
            Начать заполнение анкеты
          </Button>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h2 className="font-semibold text-sm text-gray-900 mb-2">
            Что включено в анкету:
          </h2>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>✓ Шаг 1: Контактные данные</li>
            <li>✓ Шаг 2: Паспортные данные</li>
            <li>✓ Шаг 3: Адреса регистрации и проживания</li>
            <li>✓ Шаг 4: Образование и опыт работы</li>
            <li>✓ Шаг 5: Согласия на обработку данных</li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Авто-сохранение:</strong> Данные сохраняются каждые 30 секунд автоматически
          </p>
        </div>
      </div>
    </div>
  );
}
