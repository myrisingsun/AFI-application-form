import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { QuestionnaireFormData, Education, WorkExperience } from '@/types/questionnaire';

const educationSchema = z.object({
  institution: z.string().min(3, 'Укажите учебное заведение'),
  degree: z.string().min(2, 'Укажите степень/квалификацию'),
  fieldOfStudy: z.string().min(2, 'Укажите специальность'),
  startDate: z.string().min(1, 'Обязательное поле'),
  endDate: z.string().optional(),
  current: z.boolean(),
});

const workExperienceSchema = z.object({
  company: z.string().min(2, 'Укажите название компании'),
  position: z.string().min(2, 'Укажите должность'),
  startDate: z.string().min(1, 'Обязательное поле'),
  endDate: z.string().optional(),
  current: z.boolean(),
  responsibilities: z.string().min(10, 'Опишите обязанности (минимум 10 символов)'),
});

const step4Schema = z.object({
  education: z.array(educationSchema).min(1, 'Добавьте хотя бы одно образование'),
  workExperience: z.array(workExperienceSchema),
});

type Step4FormData = z.infer<typeof step4Schema>;

interface Props {
  data: Partial<QuestionnaireFormData>;
  onChange: (data: Partial<QuestionnaireFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function Step4Education({ data, onChange, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<Step4FormData>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      education: data.education?.length ? data.education : [
        { institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', current: false }
      ],
      workExperience: data.workExperience || [],
    },
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: 'education',
  });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({
    control,
    name: 'workExperience',
  });

  const onSubmit = (formData: Step4FormData) => {
    onChange(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Шаг 4: Образование и опыт работы</h2>

      {/* Education Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Образование *</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendEducation({
                institution: '',
                degree: '',
                fieldOfStudy: '',
                startDate: '',
                endDate: '',
                current: false,
              })
            }
          >
            <Plus className="mr-2" size={16} /> Добавить образование
          </Button>
        </div>

        {educationFields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">Образование #{index + 1}</h4>
              {educationFields.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                >
                  <Trash2 size={16} className="text-red-500" />
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <Input
                  {...register(`education.${index}.institution`)}
                  placeholder="Учебное заведение"
                />
                {errors.education?.[index]?.institution && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.education[index]?.institution?.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input {...register(`education.${index}.degree`)} placeholder="Степень/Квалификация" />
                  {errors.education?.[index]?.degree && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.education[index]?.degree?.message}
                    </p>
                  )}
                </div>
                <div>
                  <Input {...register(`education.${index}.fieldOfStudy`)} placeholder="Специальность" />
                  {errors.education?.[index]?.fieldOfStudy && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.education[index]?.fieldOfStudy?.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input {...register(`education.${index}.startDate`)} type="date" placeholder="Начало" />
                <Input
                  {...register(`education.${index}.endDate`)}
                  type="date"
                  placeholder="Окончание"
                  disabled={watch(`education.${index}.current`)}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`education.${index}.current`)}
                    id={`edu-current-${index}`}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`edu-current-${index}`} className="ml-2 text-sm">
                    Учусь сейчас
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}

        {errors.education && !Array.isArray(errors.education) && (
          <p className="text-sm text-red-500">{errors.education.message}</p>
        )}
      </div>

      {/* Work Experience Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Опыт работы</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              appendWork({
                company: '',
                position: '',
                startDate: '',
                endDate: '',
                current: false,
                responsibilities: '',
              })
            }
          >
            <Plus className="mr-2" size={16} /> Добавить опыт
          </Button>
        </div>

        {workFields.length === 0 && (
          <p className="text-sm text-gray-500 mb-4">Нет записей об опыте работы</p>
        )}

        {workFields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium text-gray-700">Место работы #{index + 1}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeWork(index)}
              >
                <Trash2 size={16} className="text-red-500" />
              </Button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Input {...register(`workExperience.${index}.company`)} placeholder="Название компании" />
                <Input {...register(`workExperience.${index}.position`)} placeholder="Должность" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Input {...register(`workExperience.${index}.startDate`)} type="date" />
                <Input
                  {...register(`workExperience.${index}.endDate`)}
                  type="date"
                  disabled={watch(`workExperience.${index}.current`)}
                />
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register(`workExperience.${index}.current`)}
                    id={`work-current-${index}`}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor={`work-current-${index}`} className="ml-2 text-sm">
                    Работаю сейчас
                  </label>
                </div>
              </div>

              <textarea
                {...register(`workExperience.${index}.responsibilities`)}
                placeholder="Обязанности и достижения"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px]"
              />
              {errors.workExperience?.[index]?.responsibilities && (
                <p className="text-sm text-red-500">
                  {errors.workExperience[index]?.responsibilities?.message}
                </p>
              )}
            </div>
          </div>
        ))}
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
