'use client';

import { useState, useEffect } from 'react';
import { FileText, Eye, Download, Search, Trash2, Copy, FileCheck, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { questionnairesApi } from '@/lib/api/questionnaires';
import { Questionnaire } from '@/types/questionnaire';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

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

export default function QuestionnairesPage() {
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const [filteredQuestionnaires, setFilteredQuestionnaires] = useState<Questionnaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadQuestionnaires();
  }, []);

  useEffect(() => {
    filterQuestionnaires();
  }, [searchQuery, questionnaires]);

  const loadQuestionnaires = async () => {
    try {
      setLoading(true);
      const data = await questionnairesApi.getAll();
      setQuestionnaires(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить анкеты',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterQuestionnaires = () => {
    if (!searchQuery.trim()) {
      setFilteredQuestionnaires(questionnaires);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = questionnaires.filter((q) => {
      const fullName = `${q.candidate?.firstName} ${q.candidate?.lastName} ${q.candidate?.middleName || ''}`.toLowerCase();
      const email = q.candidate?.email?.toLowerCase() || '';
      return fullName.includes(query) || email.includes(query);
    });
    setFilteredQuestionnaires(filtered);
  };

  const handleDownloadPdf = async (id: string, candidateName: string) => {
    try {
      const blob = await questionnairesApi.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `anketa-${candidateName}.pdf`;
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

  const handleDownloadConsentPdf = async (id: string, candidateName: string) => {
    try {
      const blob = await questionnairesApi.downloadConsentPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `soglasie-PDN-${candidateName}.pdf`;
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

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту анкету? Это действие необратимо.')) {
      return;
    }

    try {
      await questionnairesApi.delete(id);
      await loadQuestionnaires();
      toast({
        title: 'Успешно',
        description: 'Анкета удалена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить анкету',
        variant: 'destructive',
      });
    }
  };

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast({
      title: 'Успешно',
      description: 'Токен скопирован в буфер обмена',
    });
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка анкет...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Анкеты кандидатов</h1>
          <p className="text-muted-foreground">
            Просмотр и управление анкетами ({filteredQuestionnaires.length} из {questionnaires.length})
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Поиск и фильтрация</CardTitle>
          <CardDescription>Найдите анкету по ФИО или email кандидата</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Поиск по ФИО или email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Все анкеты</CardTitle>
          <CardDescription>Список всех анкет кандидатов</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredQuestionnaires.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-muted-foreground mt-2">
                {searchQuery ? 'Анкеты не найдены' : 'Анкеты еще не созданы'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кандидат</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Токен приглашения</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата создания</TableHead>
                  <TableHead>Дата отправки</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestionnaires.map((questionnaire) => (
                  <TableRow key={questionnaire.id}>
                    <TableCell className="font-medium">
                      {questionnaire.candidate?.lastName} {questionnaire.candidate?.firstName}
                      {questionnaire.candidate?.middleName && ` ${questionnaire.candidate.middleName}`}
                    </TableCell>
                    <TableCell>{questionnaire.candidate?.email}</TableCell>
                    <TableCell>
                      {questionnaire.invitationToken ? (
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {questionnaire.invitationToken.substring(0, 8)}...
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToken(questionnaire.invitationToken!)}
                            title="Скопировать токен"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={StatusColors[questionnaire.status as keyof typeof StatusColors] || 'bg-gray-500'}>
                        {StatusLabels[questionnaire.status as keyof typeof StatusLabels] || questionnaire.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(questionnaire.createdAt)}</TableCell>
                    <TableCell>{formatDate(questionnaire.submittedAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/questionnaires/${questionnaire.id}`)}
                          title="Просмотреть анкету"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/dashboard/questionnaires/${questionnaire.id}/edit`)}
                          title="Редактировать анкету"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {questionnaire.status === 'submitted' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadPdf(
                                questionnaire.id!,
                                `${questionnaire.candidate?.lastName}-${questionnaire.candidate?.firstName}`
                              )}
                              title="Скачать анкету"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadConsentPdf(
                                questionnaire.id!,
                                `${questionnaire.candidate?.lastName}-${questionnaire.candidate?.firstName}`
                              )}
                              title="Скачать согласие ПДН"
                            >
                              <FileCheck className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(questionnaire.id!)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Удалить анкету"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
