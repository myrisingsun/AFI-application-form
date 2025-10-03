'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { invitationsApi } from '@/lib/api/invitations';
import { InvitationResponse } from '@/types/invitation';

const createInvitationSchema = z.object({
  firstName: z.string().min(1, 'Имя обязательно'),
  lastName: z.string().min(1, 'Фамилия обязательна'),
  middleName: z.string().optional(),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(1, 'Телефон обязателен'),
});

type CreateInvitationForm = z.infer<typeof createInvitationSchema>;

interface CreateInvitationFormProps {
  onSuccess: (invitation: InvitationResponse) => void;
}

export function CreateInvitationForm({ onSuccess }: CreateInvitationFormProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateInvitationForm>({
    resolver: zodResolver(createInvitationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
    },
  });

  const onSubmit = async (data: CreateInvitationForm) => {
    try {
      setLoading(true);
      const invitation = await invitationsApi.create(data);
      onSuccess(invitation);
      form.reset();
    } catch (error: any) {
      toast({
        title: 'Ошибка',
        description: error.response?.data?.message || 'Не удалось создать приглашение',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Фамилия *</FormLabel>
                <FormControl>
                  <Input placeholder="Иванов" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Имя *</FormLabel>
                <FormControl>
                  <Input placeholder="Иван" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="middleName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отчество</FormLabel>
              <FormControl>
                <Input placeholder="Иванович" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="ivan@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Телефон *</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="+7 (999) 123-45-67"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={loading}
          >
            Очистить
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Создание...' : 'Создать и отправить'}
          </Button>
        </div>
      </form>
    </Form>
  );
}