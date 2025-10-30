import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionnaireFormData } from '@/types/questionnaire';
import { useState } from 'react';

const today = new Date().toISOString().split('T')[0];

const passportSchema = z.object({
  passportSeries: z.string().regex(/^\d{4}$/, 'Серия должна содержать 4 цифры'),
  passportNumber: z.string().regex(/^\d{6}$/, 'Номер должен содержать 6 цифр'),
  passportIssuer: z.string().min(10, 'Укажите полное наименование'),
  passportIssueDate: z.string().min(1, 'Обязательное поле').refine((date) => date <= today, {
    message: 'Дата выдачи не может быть в будущем',
  }),
  passportIssuerCode: z.string().regex(/^\d{3}-\d{3}$/, 'Формат: XXX-XXX'),
  birthDate: z.string().min(1, 'Обязательное поле').refine((date) => date <= today, {
    message: 'Дата рождения не может быть в будущем',
  }),
  birthPlace: z.string().min(5, 'Укажите полное место рождения'),
  inn: z.string().regex(/^\d{12}$/, 'ИНН должен содержать 12 цифр'),
  snils: z.string().regex(/^\d{3}-\d{3}-\d{3} \d{2}$/, 'Формат: XXX-XXX-XXX XX'),
  // Foreign passport fields (optional)
  foreignPassportSeries: z.string().optional(),
  foreignPassportNumber: z.string().optional(),
  foreignPassportIssuer: z.string().optional(),
  foreignPassportIssueDate: z.string().optional(),
  foreignPassportExpiryDate: z.string().optional(),
});

type PassportFormData = z.infer<typeof passportSchema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step2Passport({ data, onChange, onNext, onBack }: Props) {
  const [showForeignPassport, setShowForeignPassport] = useState(false);

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
      inn: data.inn || '',
      snils: data.snils || '',
      foreignPassportSeries: data.foreignPassport?.series || '',
      foreignPassportNumber: data.foreignPassport?.number || '',
      foreignPassportIssuer: data.foreignPassport?.issuer || '',
      foreignPassportIssueDate: data.foreignPassport?.issueDate || '',
      foreignPassportExpiryDate: data.foreignPassport?.expiryDate || '',
    },
  });

  const onSubmit = (formData: PassportFormData) => {
    const {
      foreignPassportSeries,
      foreignPassportNumber,
      foreignPassportIssuer,
      foreignPassportIssueDate,
      foreignPassportExpiryDate,
      ...mainData
    } = formData;

    // Structure foreign passport data
    const foreignPassport = showForeignPassport && (
      foreignPassportSeries || foreignPassportNumber || foreignPassportIssuer ||
      foreignPassportIssueDate || foreignPassportExpiryDate
    ) ? {
      series: foreignPassportSeries,
      number: foreignPassportNumber,
      issuer: foreignPassportIssuer,
      issueDate: foreignPassportIssueDate,
      expiryDate: foreignPassportExpiryDate,
    } : undefined;

    onChange({
      ...mainData,
      foreignPassport,
    });
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
              max={today}
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
            max={today}
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

        {/* ИНН и СНИЛС */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ИНН <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('inn')}
              placeholder="123456789012"
              maxLength={12}
              className={errors.inn ? 'border-red-500' : ''}
            />
            {errors.inn && (
              <p className="text-sm text-red-500 mt-1">{errors.inn.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">12 цифр</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              СНИЛС <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('snils')}
              placeholder="123-456-789 01"
              maxLength={14}
              className={errors.snils ? 'border-red-500' : ''}
            />
            {errors.snils && (
              <p className="text-sm text-red-500 mt-1">{errors.snils.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">Формат: XXX-XXX-XXX XX</p>
          </div>
        </div>

        {/* Заграничный паспорт (опционально) */}
        <div className="border-t pt-4 mt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Заграничный паспорт <span className="text-gray-500 font-normal">(опционально)</span>
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowForeignPassport(!showForeignPassport)}
            >
              {showForeignPassport ? 'Скрыть' : 'Добавить'}
            </Button>
          </div>

          {showForeignPassport && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Серия
                  </label>
                  <Input
                    {...register('foreignPassportSeries')}
                    placeholder="12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Номер
                  </label>
                  <Input
                    {...register('foreignPassportNumber')}
                    placeholder="1234567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Кем выдан
                </label>
                <Input
                  {...register('foreignPassportIssuer')}
                  placeholder="МВД России"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата выдачи
                  </label>
                  <Input
                    {...register('foreignPassportIssueDate')}
                    type="date"
                    max={today}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дата окончания
                  </label>
                  <Input
                    {...register('foreignPassportExpiryDate')}
                    type="date"
                  />
                </div>
              </div>
            </div>
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
