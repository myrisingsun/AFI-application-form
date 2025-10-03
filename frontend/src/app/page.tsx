import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
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
              Заполните анкету и загрузите документы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/questionnaire">Заполнить анкету</a>
            </Button>
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
              <a href="/admin">Панель управления</a>
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