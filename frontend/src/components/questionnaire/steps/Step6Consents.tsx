import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { QuestionnaireFormData, Consents } from '@/types/questionnaire';

const consentsSchema = z.object({
  consents: z.object({
    pdnConsent: z.boolean().refine((val) => val === true, {
      message: 'Необходимо дать согласие на обработку персональных данных',
    }),
    photoConsent: z.boolean(),
    backgroundCheckConsent: z.boolean().refine((val) => val === true, {
      message: 'Необходимо дать согласие на проверку службой безопасности',
    }),
    medicalCheckConsent: z.boolean(),
  }),
});

type ConsentsFormData = z.infer<typeof consentsSchema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onBack: () => void;
  onSubmit: (data?: Partial<QuestionnaireFormData>) => void;
}

export function Step6Consents({ data, onChange, onBack, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsentsFormData>({
    resolver: zodResolver(consentsSchema),
    defaultValues: {
      consents: {
        pdnConsent: data.consents?.pdnConsent || false,
        photoConsent: data.consents?.photoConsent || false,
        backgroundCheckConsent: data.consents?.backgroundCheckConsent || false,
        medicalCheckConsent: data.consents?.medicalCheckConsent || false,
      },
    },
  });

  const handleFormSubmit = (formData: ConsentsFormData) => {
    // Передаем данные напрямую в onSubmit, чтобы избежать проблем с асинхронным обновлением состояния
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 6: Согласия</h2>

      <div className="space-y-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            Для продолжения процесса трудоустройства необходимо дать согласия на обработку данных
            и проведение проверок.
          </p>
        </div>

        {/* Personal Data Consent - Required */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('consents.pdnConsent')}
              id="pdnConsent"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3 flex-1">
              <label htmlFor="pdnConsent" className="font-medium text-gray-900">
                Согласие на обработку персональных данных <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Я даю согласие на обработку моих персональных данных в соответствии с
                Федеральным законом от 27.07.2006 № 152-ФЗ "О персональных данных".
              </p>
            </div>
          </div>
          {errors.consents?.pdnConsent && (
            <p className="text-sm text-red-500 mt-2 ml-8">{errors.consents.pdnConsent.message}</p>
          )}
        </div>

        {/* Background Check Consent - Required */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('consents.backgroundCheckConsent')}
              id="backgroundCheckConsent"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3 flex-1">
              <label htmlFor="backgroundCheckConsent" className="font-medium text-gray-900">
                Согласие на проверку службой безопасности <span className="text-red-500">*</span>
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Я даю согласие на проведение проверки моих данных службой безопасности компании,
                включая проверку документов, трудовой истории и рекомендаций.
              </p>
            </div>
          </div>
          {errors.consents?.backgroundCheckConsent && (
            <p className="text-sm text-red-500 mt-2 ml-8">
              {errors.consents.backgroundCheckConsent.message}
            </p>
          )}
        </div>

        {/* Photo Consent - Optional */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('consents.photoConsent')}
              id="photoConsent"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3 flex-1">
              <label htmlFor="photoConsent" className="font-medium text-gray-900">
                Согласие на фото- и видеосъемку
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Я даю согласие на использование моих фотографий и видеоматериалов для внутренних
                целей компании (пропуска, корпоративные материалы).
              </p>
            </div>
          </div>
        </div>

        {/* Medical Check Consent - Optional */}
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              {...register('consents.medicalCheckConsent')}
              id="medicalCheckConsent"
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
            />
            <div className="ml-3 flex-1">
              <label htmlFor="medicalCheckConsent" className="font-medium text-gray-900">
                Согласие на медицинский осмотр
              </label>
              <p className="text-sm text-gray-600 mt-1">
                Я даю согласие на прохождение предварительного медицинского осмотра в соответствии
                с требованиями должности.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <p className="text-sm text-blue-800">
          Для продолжения процесса трудоустройства необходимо дать согласия, отмеченные знаком *.
          Опциональные согласия вы можете дать по желанию.
        </p>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-yellow-800">
          <strong>Обратите внимание:</strong> После отправки анкеты изменить данные будет
          невозможно. Пожалуйста, проверьте всю информацию перед отправкой.
        </p>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" size={20} /> Назад
        </Button>
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          <CheckCircle className="mr-2" size={20} /> Отправить анкету
        </Button>
      </div>
    </form>
  );
}
