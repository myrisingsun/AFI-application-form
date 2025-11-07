'use client';

import { useState, useEffect } from 'react';
import { Questionnaire, QuestionnaireFormData } from '@/types/questionnaire';
import { questionnaireApi } from '@/lib/api/questionnaire';
import { StepIndicator } from './StepIndicator';
import { ProgressBar } from './ProgressBar';
import { Step1Contacts } from './steps/Step1Contacts';
import { Step2Passport } from './steps/Step2Passport';
import { Step3Address } from './steps/Step3Address';
import { Step4Education } from './steps/Step4Education';
import { Step5FamilyStatus } from './steps/Step5FamilyStatus';
import { Step6Consents } from './steps/Step6Consents';
import { Step7AdditionalInfo } from './steps/Step7AdditionalInfo';
import { SuccessPage } from './SuccessPage';

interface Props {
  token: string;
  initialData: Questionnaire | null;
}

const TOTAL_STEPS = 7;

export function QuestionnaireWizard({ token, initialData }: Props) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<QuestionnaireFormData>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load initial data
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.email || initialData.candidate?.email,
        additionalContact: initialData.additionalContact,
        passportSeries: initialData.passportSeries,
        passportNumber: initialData.passportNumber,
        passportIssuer: initialData.passportIssuer,
        passportIssueDate: initialData.passportIssueDate,
        passportIssuerCode: initialData.passportIssuerCode,
        birthDate: initialData.birthDate,
        birthPlace: initialData.birthPlace,
        inn: initialData.inn,
        snils: initialData.snils,
        foreignPassport: initialData.foreignPassport,
        registrationAddress: initialData.registrationAddress,
        actualAddress: initialData.actualAddress,
        actualAddressSameAsRegistration: initialData.actualAddressSameAsRegistration || false,
        education: initialData.education || [],
        workExperience: initialData.workExperience || [],
        references: initialData.references || [],
        maritalStatus: initialData.maritalStatus,
        familyMembers: initialData.familyMembers || [],
        consents: initialData.consents,
        entrepreneurInfo: initialData.entrepreneurInfo,
        driverLicense: initialData.driverLicense,
        criminalRecord: initialData.criminalRecord,
        relativesInCompany: initialData.relativesInCompany,
      });

      if (initialData.status === 'submitted') {
        setIsSubmitted(true);
      }
    }
  }, [initialData]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSave = setInterval(async () => {
      if (Object.keys(formData).length > 0 && !isSubmitted) {
        await handleSave();
      }
    }, 30000);

    return () => clearInterval(autoSave);
  }, [formData, isSubmitted]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await questionnaireApi.updateByToken(token, formData);
    } catch (error) {
      console.error('Failed to save:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalData?: Partial<QuestionnaireFormData>) => {
    try {
      // Объединяем текущие данные с финальными (если есть)
      const dataToSave = finalData ? { ...formData, ...finalData } : formData;

      // Сначала сохраняем все данные
      setIsSaving(true);
      await questionnaireApi.updateByToken(token, dataToSave);
      setIsSaving(false);

      // Затем отправляем анкету
      await questionnaireApi.submitByToken(token);
      setIsSubmitted(true);
    } catch (error: any) {
      setIsSaving(false);
      console.error('Submit error:', error.response?.data);

      // Показываем детальные ошибки валидации
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors.join('\n');
        alert(`Анкета не может быть отправлена:\n\n${errors}`);
      } else {
        alert(error.response?.data?.message || 'Не удалось отправить анкету');
      }
    }
  };

  const updateFormData = (data: Partial<QuestionnaireFormData>) => {
    setFormData({ ...formData, ...data });
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  if (isSubmitted) {
    return <SuccessPage candidate={initialData?.candidate} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Анкета кандидата</h1>
        <p className="text-gray-600 mb-8">
          {initialData?.candidate
            ? `${initialData.candidate.firstName} ${initialData.candidate.lastName}`
            : 'Заполните все поля анкеты'}
        </p>

        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
        <ProgressBar progress={progress} />

        <div className="mt-8">
          {currentStep === 1 && (
            <Step1Contacts
              data={initialData?.candidate}
              formData={formData}
              onChange={updateFormData}
              onNext={handleNext}
            />
          )}

          {currentStep === 2 && (
            <Step2Passport
              data={formData}
              onChange={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <Step3Address
              data={formData}
              onChange={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <Step4Education
              data={formData}
              onChange={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 5 && (
            <Step5FamilyStatus
              data={formData}
              onChange={updateFormData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 6 && (
            <Step7AdditionalInfo
              data={formData}
              onChange={updateFormData}
              onBack={handleBack}
              onNext={handleNext}
            />
          )}

          {currentStep === 7 && (
            <Step6Consents
              data={formData}
              onChange={updateFormData}
              onBack={handleBack}
              onSubmit={handleSubmit}
            />
          )}
        </div>

        {isSaving && (
          <div className="mt-4 text-sm text-gray-500 text-center">
            Сохранение...
          </div>
        )}
      </div>
    </div>
  );
}
