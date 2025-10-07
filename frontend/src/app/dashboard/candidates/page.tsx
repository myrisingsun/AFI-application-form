'use client';

import { useState, useEffect } from 'react';
import { Trash2, Eye, Copy, Check, FileText, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { candidatesApi } from '@/lib/api/candidates';
import { CandidateResponse, CandidateStatusLabels, CandidateStatusColors } from '@/types/candidate';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useRouter } from 'next/navigation';

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<CandidateResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await candidatesApi.getAll();
      setCandidates(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список кандидатов',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, fullName: string) => {
    if (!confirm(`Вы уверены, что хотите удалить кандидата ${fullName}? Это действие необратимо и удалит также анкету и все приглашения.`)) {
      return;
    }

    try {
      await candidatesApi.delete(id);
      await loadCandidates();
      toast({
        title: 'Успешно',
        description: 'Кандидат удален',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось удалить кандидата',
        variant: 'destructive',
      });
    }
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
      toast({
        title: 'Скопировано',
        description: 'Токен скопирован в буфер обмена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать токен',
        variant: 'destructive',
      });
    }
  };

  const handleCopyUrl = async (token: string) => {
    const url = `${process.env.NEXT_PUBLIC_FRONTEND_URL || window.location.origin}/questionnaire/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(token);
      setTimeout(() => setCopiedUrl(null), 2000);
      toast({
        title: 'Скопировано',
        description: 'Ссылка на анкету скопирована в буфер обмена',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось скопировать ссылку',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: ru });
  };

  const getFullName = (candidate: CandidateResponse) => {
    return [candidate.lastName, candidate.firstName, candidate.middleName]
      .filter(Boolean)
      .join(' ');
  };

  const getLatestInvitation = (candidate: CandidateResponse) => {
    if (!candidate.invitations || candidate.invitations.length === 0) {
      return null;
    }
    return candidate.invitations[0]; // Предполагаем, что они уже отсортированы
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка кандидатов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Кандидаты</h1>
          <p className="text-muted-foreground">
            Список всех кандидатов и их статусы
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все кандидаты</CardTitle>
          <CardDescription>
            Всего кандидатов: {candidates.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {candidates.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Кандидаты еще не добавлены</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ФИО</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Токен приглашения</TableHead>
                  <TableHead>Статус кандидата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => {
                  const invitation = getLatestInvitation(candidate);
                  return (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">
                        {getFullName(candidate)}
                      </TableCell>
                      <TableCell>{candidate.email}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>
                        {invitation ? (
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[120px] truncate">
                              {invitation.token.substring(0, 12)}...
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCopyToken(invitation.token)}
                              className="h-6 w-6 p-0"
                            >
                              {copiedToken === invitation.token ? (
                                <Check className="h-3 w-3 text-green-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={CandidateStatusColors[candidate.status]}>
                          {CandidateStatusLabels[candidate.status]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {candidate.questionnaire && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/dashboard/questionnaires/${candidate.questionnaire!.id}`)}
                              title="Просмотр анкеты"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          )}

                          {invitation && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopyUrl(invitation.token)}
                              title="Скопировать ссылку на анкету"
                            >
                              {copiedUrl === invitation.token ? (
                                <Check className="h-4 w-4 text-green-600" />
                              ) : (
                                <LinkIcon className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(candidate.id, getFullName(candidate))}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            title="Удалить кандидата"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
