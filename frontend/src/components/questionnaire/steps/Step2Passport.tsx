import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionnaireFormData } from '@/types/questionnaire';

const passportSchema = z.object({
  passportSeries: z.string().regex(/^\d{4}$/, 'Серия должна содержать 4 цифры'),
  passportNumber: z.string().regex(/^\d{6}$/, 'Номер должен содержать 6 цифр'),
  passportIssuer: z.string().min(10, 'Укажите полное наименование'),
  passportIssueDate: z.string().min(1, 'Обязательное поле'),
  passportIssuerCode: z.string().regex(/^\d{3}-\d{3}$/, 'Формат: XXX-XXX'),
  birthDate: z.string().min(1, 'Обязательное поле'),
  birthPlace: z.string().min(5, 'Укажите полное место рождения'),
});

type PassportFormData = z.infer<typeof passportSchema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Passport({ data, onChange, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassportFormData>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      passportSeries: data.passportSeries || '',
      passportNumber: data.passportNumber || '',
      passportIssuer: data.passportIssuer || '',
      passportIssueDate: data.passportIssueDate || '',
      passportIssuerCode: data.passportIssuerCode || '',
      birthDate: data.birthDate || '',
      birthPlace: data.birthPlace || '',
    },
  });

  const onSubmit = (formData: PassportFormData) => {
    onChange(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 2: Паспортные данные</h2>

      <div className="space-y-4 mb-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Серия паспорта <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('passportSeries')}
              placeholder="1234"
              maxLength={4}
              className={errors.passportSeries ? 'border-red-500' : ''}
            />
            {errors.passportSeries && (
              <p className="text-sm text-red-500 mt-1">{errors.passportSeries.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Номер паспорта <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('passportNumber')}
              placeholder="123456"
              maxLength={6}
              className={errors.passportNumber ? 'border-red-500' : ''}
            />
            {errors.passportNumber && (
              <p className="text-sm text-red-500 mt-1">{errors.passportNumber.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Кем выдан <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('passportIssuer')}
            placeholder="Отделением УФМС России..."
            className={errors.passportIssuer ? 'border-red-500' : ''}
          />
          {errors.passportIssuer && (
            <p className="text-sm text-red-500 mt-1">{errors.passportIssuer.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата выдачи <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('passportIssueDate')}
              type="date"
              className={errors.passportIssueDate ? 'border-red-500' : ''}
            />
            {errors.passportIssueDate && (
              <p className="text-sm text-red-500 mt-1">{errors.passportIssueDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Код подразделения <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('passportIssuerCode')}
              placeholder="123-456"
              maxLength={7}
              className={errors.passportIssuerCode ? 'border-red-500' : ''}
            />
            {errors.passportIssuerCode && (
              <p className="text-sm text-red-500 mt-1">{errors.passportIssuerCode.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Дата рождения <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('birthDate')}
            type="date"
            className={errors.birthDate ? 'border-red-500' : ''}
          />
          {errors.birthDate && (
            <p className="text-sm text-red-500 mt-1">{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Место рождения <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('birthPlace')}
            placeholder="г. Москва"
            className={errors.birthPlace ? 'border-red-500' : ''}
          />
          {errors.birthPlace && (
            <p className="text-sm text-red-500 mt-1">{errors.birthPlace.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" size={20} /> Назад
        </Button>
        <Button type="submit">
          Далее <ArrowRight className="ml-2" size={20} />
        </Button>
      </div>
    </form>
  );
}
