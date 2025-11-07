import { Check } from 'lucide-react';

interface Props {
  currentStep: number;
  totalSteps: number;
}

const stepLabels = [
  'Контакты',
  'Паспорт',
  'Адрес',
  'Образование',
  'Семейное положение',
  'Доп. информация',
  'Согласия',
];

export function StepIndicator({ currentStep, totalSteps }: Props) {
  return (
    <div className="flex items-center justify-between mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? <Check size={20} /> : stepNumber}
              </div>
              <span
                className={`mt-2 text-sm ${
                  isCurrent ? 'font-semibold text-blue-600' : 'text-gray-600'
                }`}
              >
                {stepLabels[index]}
              </span>
            </div>

            {stepNumber < totalSteps && (
              <div
                className={`h-1 flex-1 mx-2 ${
                  isCompleted ? 'bg-green-500' : 'bg-gray-200'
                }`}
                style={{ marginTop: '-40px' }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
