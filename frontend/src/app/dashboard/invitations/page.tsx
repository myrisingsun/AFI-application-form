'use client';

import { useState, useEffect } from 'react';
import { Plus, Send, RotateCcw, Trash2, Eye, Clock, CheckCircle, XCircle, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { invitationsApi } from '@/lib/api/invitations';
import { InvitationResponse, InvitationStatus, InvitationStatusLabels, InvitationStatusColors } from '@/types/invitation';
import { CreateInvitationForm } from '@/components/invitations/CreateInvitationForm';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<InvitationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadInvitations();
  }, []);

  const loadInvitations = async () => {
    try {
      setLoading(true);
      const data = await invitationsApi.getAll();
      setInvitations(data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить приглашения',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSuccess = (newInvitation: InvitationResponse) => {
    setInvitations([newInvitation, ...invitations]);
    setIsCreateOpen(false);
    toast({
      title: 'Успешно',
      description: 'Приглашение создано и отправлено',
    });
  };

  const handleResend = async (id: string) => {
    try {
      const updatedInvitation = await invitationsApi.resend(id);
      setInvitations(invitations.map(inv =>
        inv.id === id ? updatedInvitation : inv
      ));
      toast({
        title: 'Успешно',
        description: 'Приглашение отправлено повторно',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить приглашение повторно',
        variant: 'destructive',
      });
    }
  };

  const handleRevoke = async (id: string) => {
    try {
      await invitationsApi.revoke(id);
      await loadInvitations();
      toast({
        title: 'Успешно',
        description: 'Приглашение отозвано',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отозвать приглашение',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: InvitationStatus) => {
    try {
      const updatedInvitation = await invitationsApi.updateStatus(id, newStatus);
      setInvitations(invitations.map(inv =>
        inv.id === id ? updatedInvitation : inv
      ));
      toast({
        title: 'Успешно',
        description: `Статус изменен на "${InvitationStatusLabels[newStatus]}"`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус приглашения',
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

  const getStatusIcon = (status: InvitationStatus) => {
    switch (status) {
      case InvitationStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case InvitationStatus.SENT:
        return <Send className="h-4 w-4" />;
      case InvitationStatus.OPENED:
        return <Eye className="h-4 w-4" />;
      case InvitationStatus.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case InvitationStatus.EXPIRED:
      case InvitationStatus.REVOKED:
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
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
          <p className="mt-2 text-sm text-muted-foreground">Загрузка приглашений...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Приглашения</h1>
          <p className="text-muted-foreground">
            Управление приглашениями для кандидатов
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Создать приглашение
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Новое приглашение</DialogTitle>
              <DialogDescription>
                Создайте приглашение для заполнения анкеты кандидатом
              </DialogDescription>
            </DialogHeader>
            <CreateInvitationForm onSuccess={handleCreateSuccess} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Все приглашения</CardTitle>
          <CardDescription>
            Список всех отправленных приглашений и их статусы
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Приглашения еще не созданы</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsCreateOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Создать первое приглашение
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Кандидат</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Токен</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Создано</TableHead>
                  <TableHead>Истекает</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell className="font-medium">
                      {invitation.candidate.lastName} {invitation.candidate.firstName}
                      {invitation.candidate.middleName && ` ${invitation.candidate.middleName}`}
                    </TableCell>
                    <TableCell>{invitation.candidate.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded max-w-[150px] truncate">
                          {invitation.token.substring(0, 16)}...
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={InvitationStatusColors[invitation.status]}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(invitation.status)}
                            {InvitationStatusLabels[invitation.status]}
                          </span>
                        </Badge>
                        {invitation.status !== InvitationStatus.COMPLETED && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                Изменить
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                              <DialogHeader>
                                <DialogTitle>Изменить статус</DialogTitle>
                                <DialogDescription>
                                  Выберите новый статус для приглашения
                                </DialogDescription>
                              </DialogHeader>
                              <div className="grid gap-2 py-4">
                                {Object.values(InvitationStatus).map((status) => (
                                  <Button
                                    key={status}
                                    variant={invitation.status === status ? "default" : "outline"}
                                    onClick={() => handleUpdateStatus(invitation.id, status)}
                                    className="justify-start"
                                  >
                                    {getStatusIcon(status)}
                                    <span className="ml-2">{InvitationStatusLabels[status]}</span>
                                  </Button>
                                ))}
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(invitation.createdAt)}</TableCell>
                    <TableCell>{formatDate(invitation.expiresAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {invitation.status !== InvitationStatus.REVOKED &&
                         invitation.status !== InvitationStatus.EXPIRED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResend(invitation.id)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}

                        {invitation.status !== InvitationStatus.REVOKED &&
                         invitation.status !== InvitationStatus.COMPLETED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRevoke(invitation.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
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