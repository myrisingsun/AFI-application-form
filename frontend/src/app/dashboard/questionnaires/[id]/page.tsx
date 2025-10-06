'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, User, FileText, MapPin, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { questionnairesApi } from '@/lib/api/questionnaires';
import { Questionnaire } from '@/types/questionnaire';
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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: ru });
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
          {questionnaire.status === 'submitted' && (
            <Button onClick={handleDownloadPdf}>
              <Download className="h-4 w-4 mr-2" />
              Скачать PDF
            </Button>
          )}
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
        </CardContent>
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
            <p className="text-base">{questionnaire.registrationAddress || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Адрес проживания</p>
            <p className="text-base">
              {questionnaire.actualAddressSameAsRegistration
                ? 'Совпадает с адресом регистрации'
                : questionnaire.actualAddress || '—'}
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
