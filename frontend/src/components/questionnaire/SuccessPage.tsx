import { CheckCircle } from 'lucide-react';

interface Props {
  candidate?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export function SuccessPage({ candidate }: Props) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="bg-white rounded-lg shadow-lg p-12">
        <div className="flex justify-center mb-6">
          <CheckCircle size={80} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Анкета успешно отправлена!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Спасибо, {candidate?.firstName}! Ваша анкета была успешно отправлена и принята в
          обработку.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-2">Что дальше?</h2>
          <ul className="text-left text-gray-700 space-y-2">
            <li>• Копия анкеты отправлена на ваш email: {candidate?.email}</li>
            <li>• Наш рекрутер свяжется с вами в ближайшее время</li>
            <li>• Проверьте почту для получения дальнейших инструкций</li>
          </ul>
        </div>

        <p className="text-sm text-gray-500">
          Если у вас есть вопросы, пожалуйста, свяжитесь с нами.
        </p>
      </div>
    </div>
  );
}
