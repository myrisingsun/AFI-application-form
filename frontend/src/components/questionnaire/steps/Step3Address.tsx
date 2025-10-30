import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionnaireFormData, Address } from '@/types/questionnaire';

const addressComponentSchema = z.object({
  postalCode: z.string().min(6, 'Индекс должен содержать 6 цифр').max(6, 'Индекс должен содержать 6 цифр'),
  city: z.string().min(2, 'Укажите город'),
  street: z.string().min(3, 'Укажите улицу'),
  house: z.string().min(1, 'Укажите номер дома'),
  building: z.string().optional(),
  apartment: z.string().optional(),
});

const addressSchema = z.object({
  // Registration address fields
  regPostalCode: z.string().min(6, 'Индекс должен содержать 6 цифр'),
  regCity: z.string().min(2, 'Укажите город'),
  regStreet: z.string().min(3, 'Укажите улицу'),
  regHouse: z.string().min(1, 'Укажите номер дома'),
  regBuilding: z.string().optional(),
  regApartment: z.string().optional(),

  actualAddressSameAsRegistration: z.boolean(),

  // Actual address fields (optional if same as registration)
  actPostalCode: z.string().optional(),
  actCity: z.string().optional(),
  actStreet: z.string().optional(),
  actHouse: z.string().optional(),
  actBuilding: z.string().optional(),
  actApartment: z.string().optional(),
}).refine(
  (data) => {
    // If checkbox is NOT checked, actual address fields are required
    if (!data.actualAddressSameAsRegistration) {
      return data.actPostalCode && data.actCity && data.actStreet && data.actHouse &&
        data.actPostalCode.length >= 6 && data.actCity.length >= 2 &&
        data.actStreet.length >= 3 && data.actHouse.length >= 1;
    }
    return true;
  },
  {
    message: 'Заполните все обязательные поля адреса проживания',
    path: ['actPostalCode'],
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
      regPostalCode: data.registrationAddress?.postalCode || '',
      regCity: data.registrationAddress?.city || '',
      regStreet: data.registrationAddress?.street || '',
      regHouse: data.registrationAddress?.house || '',
      regBuilding: data.registrationAddress?.building || '',
      regApartment: data.registrationAddress?.apartment || '',

      actualAddressSameAsRegistration: data.actualAddressSameAsRegistration || false,

      actPostalCode: data.actualAddress?.postalCode || '',
      actCity: data.actualAddress?.city || '',
      actStreet: data.actualAddress?.street || '',
      actHouse: data.actualAddress?.house || '',
      actBuilding: data.actualAddress?.building || '',
      actApartment: data.actualAddress?.apartment || '',
    },
  });

  const sameAsRegistration = watch('actualAddressSameAsRegistration');

  const onSubmit = (formData: AddressFormData) => {
    // Structure registration address
    const registrationAddress: Address = {
      postalCode: formData.regPostalCode,
      city: formData.regCity,
      street: formData.regStreet,
      house: formData.regHouse,
      building: formData.regBuilding || undefined,
      apartment: formData.regApartment || undefined,
    };

    // Structure actual address
    const actualAddress: Address = formData.actualAddressSameAsRegistration
      ? registrationAddress // Copy registration if same
      : {
          postalCode: formData.actPostalCode!,
          city: formData.actCity!,
          street: formData.actStreet!,
          house: formData.actHouse!,
          building: formData.actBuilding || undefined,
          apartment: formData.actApartment || undefined,
        };

    onChange({
      registrationAddress,
      actualAddress,
      actualAddressSameAsRegistration: formData.actualAddressSameAsRegistration,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 3: Адрес</h2>

      <div className="space-y-6 mb-8">
        {/* Адрес регистрации */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Адрес регистрации <span className="text-red-500">*</span>
          </h3>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Индекс <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('regPostalCode')}
                  placeholder="123456"
                  maxLength={6}
                  className={errors.regPostalCode ? 'border-red-500' : ''}
                />
                {errors.regPostalCode && (
                  <p className="text-sm text-red-500 mt-1">{errors.regPostalCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Город <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('regCity')}
                  placeholder="Москва"
                  className={errors.regCity ? 'border-red-500' : ''}
                />
                {errors.regCity && (
                  <p className="text-sm text-red-500 mt-1">{errors.regCity.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Улица <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('regStreet')}
                placeholder="ул. Ленина"
                className={errors.regStreet ? 'border-red-500' : ''}
              />
              {errors.regStreet && (
                <p className="text-sm text-red-500 mt-1">{errors.regStreet.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дом <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('regHouse')}
                  placeholder="1"
                  className={errors.regHouse ? 'border-red-500' : ''}
                />
                {errors.regHouse && (
                  <p className="text-sm text-red-500 mt-1">{errors.regHouse.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Корпус
                </label>
                <Input
                  {...register('regBuilding')}
                  placeholder="2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Квартира
                </label>
                <Input
                  {...register('regApartment')}
                  placeholder="10"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Чекбокс "Адрес проживания совпадает" */}
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

        {/* Адрес фактического проживания */}
        {!sameAsRegistration && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Адрес фактического проживания <span className="text-red-500">*</span>
            </h3>
            <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Индекс <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('actPostalCode')}
                    placeholder="123456"
                    maxLength={6}
                    className={errors.actPostalCode ? 'border-red-500' : ''}
                  />
                  {errors.actPostalCode && (
                    <p className="text-sm text-red-500 mt-1">{errors.actPostalCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Город <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('actCity')}
                    placeholder="Москва"
                    className={errors.actCity ? 'border-red-500' : ''}
                  />
                  {errors.actCity && (
                    <p className="text-sm text-red-500 mt-1">{errors.actCity.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Улица <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register('actStreet')}
                  placeholder="ул. Пушкина"
                  className={errors.actStreet ? 'border-red-500' : ''}
                />
                {errors.actStreet && (
                  <p className="text-sm text-red-500 mt-1">{errors.actStreet.message}</p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Дом <span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...register('actHouse')}
                    placeholder="2"
                    className={errors.actHouse ? 'border-red-500' : ''}
                  />
                  {errors.actHouse && (
                    <p className="text-sm text-red-500 mt-1">{errors.actHouse.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Корпус
                  </label>
                  <Input
                    {...register('actBuilding')}
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Квартира
                  </label>
                  <Input
                    {...register('actApartment')}
                    placeholder="5"
                  />
                </div>
              </div>
            </div>
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
