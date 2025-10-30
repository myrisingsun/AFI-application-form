import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { QuestionnaireFormData, MaritalStatus, FamilyMember } from '@/types/questionnaire';

const maritalStatusLabels: Record<MaritalStatus, string> = {
  [MaritalStatus.MARRIED]: 'Женат/Замужем',
  [MaritalStatus.SINGLE]: 'Холост/Не замужем',
  [MaritalStatus.DIVORCED]: 'Разведен(а)',
};

const familyStatusSchema = z.object({
  maritalStatus: z.nativeEnum(MaritalStatus, { required_error: 'Выберите семейное положение' }),
});

type FamilyStatusFormData = z.infer<typeof familyStatusSchema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step5FamilyStatus({ data, onChange, onNext, onBack }: Props) {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(data.familyMembers || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FamilyStatusFormData>({
    resolver: zodResolver(familyStatusSchema),
    defaultValues: {
      maritalStatus: data.maritalStatus,
    },
  });

  const addFamilyMember = () => {
    setFamilyMembers([
      ...familyMembers,
      { relationship: '', fullName: '', contactInfo: '', workplace: '', position: '' },
    ]);
  };

  const removeFamilyMember = (index: number) => {
    setFamilyMembers(familyMembers.filter((_, i) => i !== index));
  };

  const updateFamilyMember = (index: number, field: keyof FamilyMember, value: string) => {
    const updated = [...familyMembers];
    updated[index] = { ...updated[index], [field]: value };
    setFamilyMembers(updated);
  };

  const onSubmit = (formData: FamilyStatusFormData) => {
    onChange({
      maritalStatus: formData.maritalStatus,
      familyMembers: familyMembers.length > 0 ? familyMembers : undefined,
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 5: Семейное положение</h2>

      <div className="space-y-6 mb-8">
        {/* Marital Status Selection */}
        <div>
          <Label>
            Семейное положение <span className="text-red-500">*</span>
          </Label>
          <div className="mt-2 space-y-2">
            {Object.entries(maritalStatusLabels).map(([value, label]) => (
              <div key={value} className="flex items-center">
                <input
                  {...register('maritalStatus')}
                  type="radio"
                  id={`status-${value}`}
                  value={value}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor={`status-${value}`} className="ml-2 block text-sm text-gray-700">
                  {label}
                </label>
              </div>
            ))}
          </div>
          {errors.maritalStatus && (
            <p className="text-sm text-red-500 mt-1">{errors.maritalStatus.message}</p>
          )}
        </div>

        {/* Family Members Table */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Члены семьи <span className="text-gray-500 font-normal">(опционально)</span>
            </h3>
            <Button type="button" variant="outline" size="sm" onClick={addFamilyMember}>
              <Plus className="mr-2" size={16} /> Добавить
            </Button>
          </div>

          {familyMembers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-sm">
                Нет добавленных членов семьи. Нажмите "Добавить" чтобы добавить информацию.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {familyMembers.map((member, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-gray-700">Член семьи #{index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFamilyMember(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`relationship-${index}`} className="text-sm">
                        Степень родства <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`relationship-${index}`}
                        value={member.relationship}
                        onChange={(e) => updateFamilyMember(index, 'relationship', e.target.value)}
                        placeholder="Например: мать, отец, супруг(а)"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`fullName-${index}`} className="text-sm">
                        ФИО <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`fullName-${index}`}
                        value={member.fullName}
                        onChange={(e) => updateFamilyMember(index, 'fullName', e.target.value)}
                        placeholder="Иванов Иван Иванович"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`contactInfo-${index}`} className="text-sm">
                        Контактная информация <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`contactInfo-${index}`}
                        value={member.contactInfo}
                        onChange={(e) => updateFamilyMember(index, 'contactInfo', e.target.value)}
                        placeholder="+7 (999) 123-45-67"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`workplace-${index}`} className="text-sm">
                        Место работы <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`workplace-${index}`}
                        value={member.workplace}
                        onChange={(e) => updateFamilyMember(index, 'workplace', e.target.value)}
                        placeholder="Название организации"
                        className="mt-1"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor={`position-${index}`} className="text-sm">
                        Должность <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id={`position-${index}`}
                        value={member.position}
                        onChange={(e) => updateFamilyMember(index, 'position', e.target.value)}
                        placeholder="Должность"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {familyMembers.length > 0 && familyMembers.some(
            (m) => !m.relationship || !m.fullName || !m.contactInfo || !m.workplace || !m.position
          ) && (
            <div className="mt-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-md">
              Заполните все поля для каждого члена семьи или удалите незаполненные записи
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          Укажите ваше текущее семейное положение. Информация о членах семьи является опциональной.
        </p>
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
