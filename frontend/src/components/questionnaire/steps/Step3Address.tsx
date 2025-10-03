import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionnaireFormData } from '@/types/questionnaire';

const addressSchema = z.object({
  registrationAddress: z.string().min(10, 'Укажите полный адрес регистрации'),
  actualAddressSameAsRegistration: z.boolean(),
  actualAddress: z.string().optional(),
}).refine(
  (data) => {
    if (!data.actualAddressSameAsRegistration && !data.actualAddress) {
      return false;
    }
    return true;
  },
  {
    message: 'Укажите адрес проживания или отметьте, что он совпадает с регистрацией',
    path: ['actualAddress'],
  }
);

type AddressFormData = z.infer<typeof addressSchema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step3Address({ data, onChange, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      registrationAddress: data.registrationAddress || '',
      actualAddressSameAsRegistration: data.actualAddressSameAsRegistration || false,
      actualAddress: data.actualAddress || '',
    },
  });

  const sameAsRegistration = watch('actualAddressSameAsRegistration');

  const onSubmit = (formData: AddressFormData) => {
    onChange(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 3: Адрес</h2>

      <div className="space-y-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Адрес регистрации <span className="text-red-500">*</span>
          </label>
          <Input
            {...register('registrationAddress')}
            placeholder="г. Москва, ул. Ленина, д. 1, кв. 1"
            className={errors.registrationAddress ? 'border-red-500' : ''}
          />
          {errors.registrationAddress && (
            <p className="text-sm text-red-500 mt-1">{errors.registrationAddress.message}</p>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            {...register('actualAddressSameAsRegistration')}
            id="sameAddress"
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="sameAddress" className="ml-2 block text-sm text-gray-700">
            Адрес проживания совпадает с адресом регистрации
          </label>
        </div>

        {!sameAsRegistration && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адрес фактического проживания <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('actualAddress')}
              placeholder="г. Москва, ул. Пушкина, д. 2, кв. 2"
              className={errors.actualAddress ? 'border-red-500' : ''}
            />
            {errors.actualAddress && (
              <p className="text-sm text-red-500 mt-1">{errors.actualAddress.message}</p>
            )}
          </div>
        )}
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
