'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function HomePage() {
  const [token, setToken] = useState('');
  const router = useRouter();

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      router.push(`/questionnaire/${token.trim()}`);
    }
  };

  return (
    <div className="container mx-auto py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AFI Application Form System
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Система управления анкетами кандидатов с возможностью проверки службой безопасности
          и загрузки документов
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Для кандидатов</CardTitle>
            <CardDescription>
              Заполните анкету по токену из приглашения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleTokenSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Токен приглашения</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Введите токен из приглашения"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
              <Button type="submit" className="w-full" disabled={!token.trim()}>
                Заполнить анкету
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Для рекрутеров</CardTitle>
            <CardDescription>
              Управление кандидатами и приглашениями
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/dashboard">Панель управления</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Документация</CardTitle>
            <CardDescription>
              API документация и техническая информация
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" asChild>
              <a href="/api/docs" target="_blank">API Docs</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}