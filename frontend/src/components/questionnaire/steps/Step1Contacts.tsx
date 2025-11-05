import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowRight } from 'lucide-react';

interface Props {
  data?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone: string;
  };
  formData?: {
    firstName?: string;
    lastName?: string;
    middleName?: string;
    phone?: string;
    email?: string;
    additionalContact?: string;
  };
  onChange?: (data: any) => void;
  onNext: () => void;
}

export function Step1Contacts({ data, formData, onChange, onNext }: Props) {
  const [localData, setLocalData] = useState({
    firstName: formData?.firstName || data?.firstName || '',
    lastName: formData?.lastName || data?.lastName || '',
    middleName: formData?.middleName || data?.middleName || '',
    phone: formData?.phone || data?.phone || '',
    email: formData?.email || data?.email || '',
    additionalContact: formData?.additionalContact || '',
  });

  if (!data) {
    return <div>Загрузка данных...</div>;
  }

  const handleChange = (field: string, value: string) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    if (onChange) {
      onChange(updated);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 1: Контактные данные</h2>

      <div className="space-y-4 mb-8">
        <div>
          <Label htmlFor="lastName">
            Фамилия <span className="text-red-500">*</span>
          </Label>
          <Input
            id="lastName"
            value={localData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            placeholder="Введите фамилию"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="firstName">
            Имя <span className="text-red-500">*</span>
          </Label>
          <Input
            id="firstName"
            value={localData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            placeholder="Введите имя"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="middleName">
            Отчество <span className="text-gray-500">(опционально)</span>
          </Label>
          <Input
            id="middleName"
            value={localData.middleName}
            onChange={(e) => handleChange('middleName', e.target.value)}
            placeholder="Введите отчество"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="phone">
            Телефон <span className="text-red-500">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={localData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="+7 (___) ___-__-__"
            className="mt-1"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={localData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="email@example.com"
            className="mt-1"
            required
          />
        </div>

        {/* Новое поле: Дополнительный контакт */}
        <div>
          <Label htmlFor="additionalContact">
            Дополнительный контакт <span className="text-gray-500">(опционально)</span>
          </Label>
          <Textarea
            id="additionalContact"
            value={localData.additionalContact}
            onChange={(e) => handleChange('additionalContact', e.target.value)}
            placeholder="Укажите дополнительный телефон, email или мессенджер (например, Telegram: @username)"
            rows={3}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Можно указать запасной номер телефона, дополнительный email или контакт в мессенджере
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext}>
          Далее <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </div>
  );
}
