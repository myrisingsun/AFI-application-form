import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface Props {
  data?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
  };
  onNext: () => void;
}

export function Step1Contacts({ data, onNext }: Props) {
  if (!data) {
    return <div>Загрузка данных...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 1: Контактные данные</h2>

      <div className="space-y-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
          <p className="text-lg font-semibold">{data.lastName}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
          <p className="text-lg font-semibold">{data.firstName}</p>
        </div>

        {data.middleName && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-1">Отчество</label>
            <p className="text-lg font-semibold">{data.middleName}</p>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-lg font-semibold">{data.email}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
          <p className="text-lg font-semibold">{data.phone}</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Контактные данные были предзаполнены из приглашения. Если вы заметили ошибку,
          пожалуйста, свяжитесь с рекрутером.
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>
          Далее <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}
