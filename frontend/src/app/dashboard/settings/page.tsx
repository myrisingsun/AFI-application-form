'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';
import { Trash2, Pencil, Plus } from 'lucide-react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'admin' | 'recruiter' | 'security' | 'viewer';
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [currentUserRole, setCurrentUserRole] = useState<string>('');

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnQuestionnaireSubmitted: true,
    emailOnDocumentsUploaded: true,
    emailOnInvitationExpiring: true,
    expiringInvitationDays: 3,
    digestFrequency: 'none' as 'none' | 'daily' | 'weekly',
  });

  // Invitation settings state
  const [invitationSettings, setInvitationSettings] = useState({
    defaultExpiryDays: 14,
    autoSendEmail: true,
    emailTemplate: '',
  });

  // Users management state
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'recruiter' as 'admin' | 'recruiter' | 'security' | 'viewer',
  });
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await authApi.profile();
      const user = response.data;

      setCurrentUserRole(user.role || '');

      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        email: user.email || '',
      });

      if (user.notificationSettings) {
        setNotificationSettings(user.notificationSettings);
      }

      if (user.invitationSettings) {
        setInvitationSettings({
          defaultExpiryDays: user.invitationSettings.defaultExpiryDays || 14,
          autoSendEmail: user.invitationSettings.autoSendEmail !== false,
          emailTemplate: user.invitationSettings.emailTemplate || '',
        });
      }

      // Load users if admin
      if (user.role === 'admin') {
        loadUsers();
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить профиль',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await authApi.getAllUsers();
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить список пользователей',
        variant: 'destructive',
      });
    }
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await authApi.updateProfile(profileData);
      toast({
        title: 'Успешно',
        description: 'Профиль обновлен',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось обновить профиль',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Пароль должен быть не менее 6 символов',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      toast({
        title: 'Успешно',
        description: 'Пароль изменен',
      });
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось изменить пароль',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await authApi.updateNotificationSettings(notificationSettings);
      toast({
        title: 'Успешно',
        description: 'Настройки уведомлений обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки уведомлений',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveInvitations = async () => {
    try {
      setSaving(true);
      await authApi.updateInvitationSettings(invitationSettings);
      toast({
        title: 'Успешно',
        description: 'Настройки приглашений обновлены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить настройки приглашений',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.firstName || !newUser.lastName) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);
      await authApi.createUser(newUser);
      toast({
        title: 'Успешно',
        description: 'Пользователь создан',
      });
      setNewUser({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'recruiter',
      });
      setShowCreateForm(false);
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать пользователя',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setSaving(true);
      const updateData: any = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        phone: editingUser.phone,
        email: editingUser.email,
        role: editingUser.role,
      };

      await authApi.updateUser(editingUser.id, updateData);
      toast({
        title: 'Успешно',
        description: 'Пользователь обновлен',
      });
      setEditingUser(null);
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось обновить пользователя',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      setSaving(true);
      await authApi.deleteUser(userId);
      toast({
        title: 'Успешно',
        description: 'Пользователь удален',
      });
      loadUsers();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось удалить пользователя',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  const isAdmin = currentUserRole === 'admin';
  const tabsGridCols = isAdmin ? 'grid-cols-4' : 'grid-cols-3';

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Настройки</h1>
        <p className="text-muted-foreground">
          Управление профилем и настройками системы
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className={`grid w-full max-w-2xl ${tabsGridCols}`}>
          <TabsTrigger value="profile">Профиль</TabsTrigger>
          <TabsTrigger value="notifications">Уведомления</TabsTrigger>
          <TabsTrigger value="invitations">Приглашения</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Пользователи</TabsTrigger>}
        </TabsList>

        <TabsContent value="profile" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Личная информация</CardTitle>
              <CardDescription>
                Обновите ваши персональные данные
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  placeholder="+7 (999) 123-45-67"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Смена пароля</CardTitle>
              <CardDescription>
                Обновите ваш пароль для доступа к системе
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Текущий пароль</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Новый пароль</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите новый пароль</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                />
              </div>

              <Button onClick={handleChangePassword} disabled={saving}>
                {saving ? 'Изменение...' : 'Изменить пароль'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Email-уведомления</CardTitle>
              <CardDescription>
                Настройте какие уведомления вы хотите получать по email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailOnQuestionnaireSubmitted"
                  checked={notificationSettings.emailOnQuestionnaireSubmitted}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnQuestionnaireSubmitted: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="emailOnQuestionnaireSubmitted" className="cursor-pointer">
                  Получать email о новых заполненных анкетах
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emailOnDocumentsUploaded"
                  checked={notificationSettings.emailOnDocumentsUploaded}
                  onCheckedChange={(checked) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailOnDocumentsUploaded: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="emailOnDocumentsUploaded" className="cursor-pointer">
                  Получать email о загруженных документах
                </Label>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emailOnInvitationExpiring"
                    checked={notificationSettings.emailOnInvitationExpiring}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({
                        ...notificationSettings,
                        emailOnInvitationExpiring: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="emailOnInvitationExpiring" className="cursor-pointer">
                    Уведомления об истекающих приглашениях
                  </Label>
                </div>

                {notificationSettings.emailOnInvitationExpiring && (
                  <div className="ml-6 space-y-2">
                    <Label htmlFor="expiringInvitationDays">За сколько дней уведомлять</Label>
                    <Input
                      id="expiringInvitationDays"
                      type="number"
                      min="1"
                      max="30"
                      value={notificationSettings.expiringInvitationDays}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          expiringInvitationDays: parseInt(e.target.value) || 3,
                        })
                      }
                      className="w-32"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="digestFrequency">Частота дайджеста</Label>
                <Select
                  value={notificationSettings.digestFrequency}
                  onValueChange={(value) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      digestFrequency: value as 'none' | 'daily' | 'weekly',
                    })
                  }
                >
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не отправлять дайджест</SelectItem>
                    <SelectItem value="daily">Ежедневно</SelectItem>
                    <SelectItem value="weekly">Еженедельно</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveNotifications} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить настройки'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invitations" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Настройки приглашений</CardTitle>
              <CardDescription>
                Настройте параметры по умолчанию для создания приглашений
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultExpiryDays">Срок действия приглашения по умолчанию (дней)</Label>
                <Input
                  id="defaultExpiryDays"
                  type="number"
                  min="1"
                  max="90"
                  value={invitationSettings.defaultExpiryDays}
                  onChange={(e) =>
                    setInvitationSettings({
                      ...invitationSettings,
                      defaultExpiryDays: parseInt(e.target.value) || 14,
                    })
                  }
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Приглашения будут действительны в течение указанного количества дней
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autoSendEmail"
                  checked={invitationSettings.autoSendEmail}
                  onCheckedChange={(checked) =>
                    setInvitationSettings({
                      ...invitationSettings,
                      autoSendEmail: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="autoSendEmail" className="cursor-pointer">
                  Автоматически отправлять email при создании приглашения
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailTemplate">Пользовательский шаблон email-приглашения</Label>
                <Textarea
                  id="emailTemplate"
                  value={invitationSettings.emailTemplate}
                  onChange={(e) =>
                    setInvitationSettings({
                      ...invitationSettings,
                      emailTemplate: e.target.value,
                    })
                  }
                  placeholder="Оставьте пустым для использования стандартного шаблона"
                  rows={10}
                  className="font-mono text-sm"
                />
                <p className="text-sm text-muted-foreground">
                  Вы можете настроить текст приглашения. Если поле пустое, будет использован стандартный шаблон.
                </p>
              </div>

              <Button onClick={handleSaveInvitations} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить настройки'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-4 mt-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Управление пользователями</CardTitle>
                    <CardDescription>
                      Создавайте и управляйте пользователями системы
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowCreateForm(!showCreateForm)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать пользователя
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {showCreateForm && (
                  <Card className="border-2 border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Новый пользователь</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Фамилия *</Label>
                          <Input
                            value={newUser.lastName}
                            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Имя *</Label>
                          <Input
                            value={newUser.firstName}
                            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Email *</Label>
                        <Input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Пароль *</Label>
                        <Input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Телефон</Label>
                        <Input
                          value={newUser.phone}
                          onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                          placeholder="+7 (999) 123-45-67"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Роль *</Label>
                        <Select
                          value={newUser.role}
                          onValueChange={(value) => setNewUser({ ...newUser, role: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Администратор</SelectItem>
                            <SelectItem value="recruiter">Рекрутер</SelectItem>
                            <SelectItem value="security">Безопасность</SelectItem>
                            <SelectItem value="viewer">Наблюдатель</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={handleCreateUser} disabled={saving}>
                          {saving ? 'Создание...' : 'Создать'}
                        </Button>
                        <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                          Отмена
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-3">
                  {users.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-4">
                        {editingUser?.id === user.id ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Фамилия</Label>
                                <Input
                                  value={editingUser.lastName}
                                  onChange={(e) =>
                                    setEditingUser({ ...editingUser, lastName: e.target.value })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Имя</Label>
                                <Input
                                  value={editingUser.firstName}
                                  onChange={(e) =>
                                    setEditingUser({ ...editingUser, firstName: e.target.value })
                                  }
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label>Email</Label>
                              <Input
                                type="email"
                                value={editingUser.email}
                                onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Телефон</Label>
                              <Input
                                value={editingUser.phone || ''}
                                onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Роль</Label>
                              <Select
                                value={editingUser.role}
                                onValueChange={(value) =>
                                  setEditingUser({ ...editingUser, role: value as any })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Администратор</SelectItem>
                                  <SelectItem value="recruiter">Рекрутер</SelectItem>
                                  <SelectItem value="security">Безопасность</SelectItem>
                                  <SelectItem value="viewer">Наблюдатель</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-2">
                              <Button onClick={handleUpdateUser} disabled={saving} size="sm">
                                {saving ? 'Сохранение...' : 'Сохранить'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setEditingUser(null)}
                                size="sm"
                              >
                                Отмена
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-semibold">
                                {user.lastName} {user.firstName}
                              </h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Роль:{' '}
                                {user.role === 'admin'
                                  ? 'Администратор'
                                  : user.role === 'recruiter'
                                  ? 'Рекрутер'
                                  : user.role === 'security'
                                  ? 'Безопасность'
                                  : 'Наблюдатель'}
                                {user.phone && ` • ${user.phone}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingUser(user)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}

                  {users.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      Нет пользователей для отображения
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
