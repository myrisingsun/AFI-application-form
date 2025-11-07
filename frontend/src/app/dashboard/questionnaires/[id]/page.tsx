'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, User, FileText, MapPin, GraduationCap, Briefcase, CheckCircle, Trash2, FileCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { questionnairesApi } from '@/lib/api/questionnaires';
import { Questionnaire, Address, ForeignPassport } from '@/types/questionnaire';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

const StatusLabels = {
  draft: 'Черновик',
  submitted: 'Отправлена',
  reviewed: 'Проверена',
  approved: 'Одобрена',
  rejected: 'Отклонена',
};

const StatusColors = {
  draft: 'bg-gray-500',
  submitted: 'bg-blue-500',
  reviewed: 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
};

export default function QuestionnaireDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQuestionnaire();
  }, [params.id]);

  const loadQuestionnaire = async () => {
    try {
      setLoading(true);
      const data = await questionnairesApi.getById(params.id as string);
      setQuestionnaire(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить анкету',
        variant: 'destructive',
      });
      router.push('/dashboard/questionnaires');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!questionnaire) return;

    try {
      const blob = await questionnairesApi.downloadPdf(questionnaire.id!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anketa-${questionnaire.candidate?.lastName}-${questionnaire.candidate?.firstName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Успешно',
        description: 'PDF анкеты скачан',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скачать PDF',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadConsentPdf = async () => {
    if (!questionnaire) return;

    try {
      const blob = await questionnairesApi.downloadConsentPdf(questionnaire.id!);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soglasie-PDN-${questionnaire.candidate?.lastName}-${questionnaire.candidate?.firstName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: 'Успешно',
        description: 'PDF согласия на обработку ПДН скачан',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скачать PDF согласия',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!questionnaire) return;

    if (!confirm('Вы уверены, что хотите удалить эту анкету? Это действие необратимо.')) {
      return;
    }

    try {
      await questionnairesApi.delete(questionnaire.id!);
      toast({
        title: 'Успешно',
        description: 'Анкета удалена',
      });
      router.push('/dashboard/questionnaires');
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить анкету',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
  };

  const formatAddress = (address: Address | string | null | undefined) => {
    if (!address) return '—';

    // If address is already a string, return it
    if (typeof address === 'string') return address;

    // Format address object
    const parts = [
      address.postalCode && `${address.postalCode}`,
      address.city,
      address.street,
      address.house && `д. ${address.house}`,
      address.building && `корп. ${address.building}`,
      address.apartment && `кв. ${address.apartment}`,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : '—';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка анкеты...</p>
        </div>
      </div>
    );
  }

  if (!questionnaire) {
    return null;
  }

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/questionnaires')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Анкета кандидата</h1>
            <p className="text-muted-foreground">
              {questionnaire.candidate?.firstName} {questionnaire.candidate?.lastName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={StatusColors[questionnaire.status as keyof typeof StatusColors] || 'bg-gray-500'}>
            {StatusLabels[questionnaire.status as keyof typeof StatusLabels] || questionnaire.status}
          </Badge>
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/questionnaires/${questionnaire.id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Редактировать
          </Button>
          {questionnaire.status === 'submitted' && (
            <>
              <Button onClick={handleDownloadPdf}>
                <Download className="h-4 w-4 mr-2" />
                Скачать анкету
              </Button>
              <Button onClick={handleDownloadConsentPdf} variant="outline">
                <FileCheck className="h-4 w-4 mr-2" />
                Скачать согласие ПДН
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Удалить
          </Button>
        </div>
      </div>

      {/* Контактная информация */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Контактная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-base">{questionnaire.candidate?.email || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Телефон</p>
            <p className="text-base">{questionnaire.candidate?.phone || '—'}</p>
          </div>
          {questionnaire.additionalContact && (
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-500">Дополнительный контакт</p>
              <p className="text-base">{questionnaire.additionalContact}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Паспортные данные */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Паспортные данные
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Серия и номер</p>
            <p className="text-base">{questionnaire.passportSeries} {questionnaire.passportNumber}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Кем выдан</p>
            <p className="text-base">{questionnaire.passportIssuer || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Дата выдачи</p>
            <p className="text-base">{formatDate(questionnaire.passportIssueDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Код подразделения</p>
            <p className="text-base">{questionnaire.passportIssuerCode || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Дата рождения</p>
            <p className="text-base">{formatDate(questionnaire.birthDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Место рождения</p>
            <p className="text-base">{questionnaire.birthPlace || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">ИНН</p>
            <p className="text-base">{questionnaire.inn || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">СНИЛС</p>
            <p className="text-base">{questionnaire.snils || '—'}</p>
          </div>
        </CardContent>

        {/* ВРЕМЕННО СКРЫТО - Sprint 6. Раскомментировать для возврата функциональности */}
        {/*
        {questionnaire.foreignPassport && (
          <CardContent className="mt-4 pt-4 border-t">
            <h3 className="font-semibold mb-3">Заграничный паспорт</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Серия и номер</p>
                <p className="text-base">
                  {questionnaire.foreignPassport.series} {questionnaire.foreignPassport.number || '—'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Кем выдан</p>
                <p className="text-base">{questionnaire.foreignPassport.issuer || '—'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Дата выдачи</p>
                <p className="text-base">{formatDate(questionnaire.foreignPassport.issueDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Срок действия</p>
                <p className="text-base">{formatDate(questionnaire.foreignPassport.expiryDate)}</p>
              </div>
            </div>
          </CardContent>
        )}
        */}
      </Card>

      {/* Адреса */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Адресная информация
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Адрес регистрации</p>
            <p className="text-base">{formatAddress(questionnaire.registrationAddress)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Адрес проживания</p>
            <p className="text-base">
              {questionnaire.actualAddressSameAsRegistration
                ? 'Совпадает с адресом регистрации'
                : formatAddress(questionnaire.actualAddress)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Образование */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Образование
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questionnaire.education && questionnaire.education.length > 0 ? (
            <div className="space-y-4">
              {questionnaire.education.map((edu: any, index: number) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <p className="font-medium">{edu.institution}</p>
                  <p className="text-sm text-gray-600">{edu.degree} - {edu.fieldOfStudy}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(edu.startDate)} - {edu.current ? 'Настоящее время' : formatDate(edu.endDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет данных</p>
          )}
        </CardContent>
      </Card>

      {/* Опыт работы */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Опыт работы
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questionnaire.workExperience && questionnaire.workExperience.length > 0 ? (
            <div className="space-y-4">
              {questionnaire.workExperience.map((work: any, index: number) => (
                <div key={index} className="border-l-4 border-green-500 pl-4">
                  <p className="font-medium">{work.company} - {work.position}</p>
                  <p className="text-sm text-gray-600">{work.responsibilities}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(work.startDate)} - {work.current ? 'Настоящее время' : formatDate(work.endDate)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет данных об опыте работы</p>
          )}
        </CardContent>
      </Card>

      {/* Профессиональные рекомендации */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Профессиональные рекомендации
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questionnaire.references && questionnaire.references.length > 0 ? (
            <div className="space-y-4">
              {questionnaire.references.map((ref: any, index: number) => (
                <div key={index} className="border-l-4 border-orange-500 pl-4 bg-gray-50 p-3 rounded">
                  <p className="font-medium text-base">{ref.fullName}</p>
                  <p className="text-sm text-gray-600">Должность: {ref.position}</p>
                  <p className="text-sm text-gray-600">Место работы: {ref.workplace}</p>
                  <p className="text-sm text-gray-600">Телефон: {ref.phone}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Нет профессиональных рекомендаций</p>
          )}
        </CardContent>
      </Card>

      {/* Семейное положение */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Семейное положение
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500">Статус</p>
            <p className="text-base">
              {questionnaire.maritalStatus === 'married' && 'Женат/Замужем'}
              {questionnaire.maritalStatus === 'single' && 'Холост/Не замужем'}
              {questionnaire.maritalStatus === 'divorced' && 'Разведен(а)'}
              {!questionnaire.maritalStatus && '—'}
            </p>
          </div>

          {questionnaire.familyMembers && questionnaire.familyMembers.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-3">Члены семьи</p>
              <div className="space-y-4">
                {questionnaire.familyMembers.map((member: any, index: number) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4 bg-gray-50 p-3 rounded">
                    <p className="font-medium">{member.fullName}</p>
                    <p className="text-sm text-gray-600">Степень родства: {member.relationship}</p>
                    <p className="text-sm text-gray-600">Контакт: {member.contactInfo}</p>
                    <p className="text-sm text-gray-600">Место работы: {member.workplace}</p>
                    <p className="text-sm text-gray-600">Должность: {member.position}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Дополнительная информация */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Дополнительная информация
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Предпринимательская деятельность */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Индивидуальный предприниматель / учредитель
              </p>
              <p className="text-base">
                {questionnaire.entrepreneurInfo?.isEntrepreneur ? 'Да' : 'Нет'}
              </p>
              {questionnaire.entrepreneurInfo?.details && (
                <p className="text-sm text-gray-600 mt-1">
                  Уточнение: {questionnaire.entrepreneurInfo.details}
                </p>
              )}
            </div>

            {/* Водительское удостоверение */}
            <div>
              <p className="text-sm font-medium text-gray-500">Водительское удостоверение</p>
              <p className="text-base">
                {questionnaire.driverLicense?.hasLicense ? 'Да' : 'Нет'}
              </p>
              {questionnaire.driverLicense?.hasLicense && (
                <div className="text-sm text-gray-600 mt-1 space-y-1">
                  {questionnaire.driverLicense.number && (
                    <p>Номер: {questionnaire.driverLicense.number}</p>
                  )}
                  {questionnaire.driverLicense.category && (
                    <p>Категория: {questionnaire.driverLicense.category}</p>
                  )}
                  {questionnaire.driverLicense.experienceYears && (
                    <p>Стаж: {questionnaire.driverLicense.experienceYears} лет</p>
                  )}
                </div>
              )}
            </div>

            {/* Судимости */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Судимости (в т.ч. погашенные)
              </p>
              <p className="text-base">
                {questionnaire.criminalRecord?.hasCriminalRecord ? 'Да' : 'Нет'}
              </p>
              {questionnaire.criminalRecord?.details && (
                <p className="text-sm text-gray-600 mt-1">
                  Подробности: {questionnaire.criminalRecord.details}
                </p>
              )}
            </div>

            {/* Родственники в компании */}
            <div>
              <p className="text-sm font-medium text-gray-500">
                Родственники/знакомые в AFI Development
              </p>
              <p className="text-base">
                {questionnaire.relativesInCompany?.hasRelativesInCompany ? 'Да' : 'Нет'}
              </p>
              {questionnaire.relativesInCompany?.details && (
                <p className="text-sm text-gray-600 mt-1">
                  ФИО: {questionnaire.relativesInCompany.details}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Согласия */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Согласия
          </CardTitle>
        </CardHeader>
        <CardContent>
          {questionnaire.consents ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {questionnaire.consents.pdnConsent ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-5 w-5 text-red-600">✗</span>
                )}
                <span>Обработка персональных данных</span>
              </div>
              <div className="flex items-center gap-2">
                {questionnaire.consents.backgroundCheckConsent ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-5 w-5 text-red-600">✗</span>
                )}
                <span>Проверка службой безопасности</span>
              </div>
              <div className="flex items-center gap-2">
                {questionnaire.consents.photoConsent ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-5 w-5 text-gray-400">✗</span>
                )}
                <span>Фото- и видеосъемка (опционально)</span>
              </div>
              <div className="flex items-center gap-2">
                {questionnaire.consents.medicalCheckConsent ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <span className="h-5 w-5 text-gray-400">✗</span>
                )}
                <span>Медицинский осмотр (опционально)</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Нет данных о согласиях</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
