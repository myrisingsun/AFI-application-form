# PDF Templates

Эта папка содержит Handlebars шаблоны для генерации PDF документов.

## Быстрый старт

### 1. Создай шаблон

Создай файл `my-document.hbs` в этой папке:

```handlebars
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Times New Roman', serif; font-size: 11pt; }
    </style>
</head>
<body>
    <h1>{{title}}</h1>
    <p>Создано: {{formatDate createdAt "DD.MM.YYYY"}}</p>
</body>
</html>
```

### 2. Используй в коде

```typescript
const pdf = await this.pdfService.generateQuestionnairePdf(data);
```

## Доступные шаблоны

- **questionnaire.hbs** - Анкета кандидата (полная версия)

## Доступные helpers

- `{{formatDate date "DD.MM.YYYY"}}` - форматирование дат
- `{{defaultValue value "По умолчанию"}}` - значение по умолчанию
- `{{increment @index}}` - увеличение индекса на 1
- `{{firstLetter name}}` - первая буква
- `{{arrayLength array}}` - длина массива
- `{{formatPhone phone}}` - форматирование телефона
- `{{yesNo boolean}}` - Да/Нет
- `{{age birthDate}}` - возраст
- И еще 15+ helpers в `helpers/template.helpers.ts`

## Подробная документация

См. [PDF-TEMPLATE-GUIDE.md](../PDF-TEMPLATE-GUIDE.md) для полного руководства.

## Пример данных для questionnaire.hbs

```json
{
  "id": "uuid",
  "candidate": {
    "firstName": "Иван",
    "lastName": "Иванов",
    "middleName": "Петрович",
    "email": "ivan@example.com",
    "phone": "+79991234567"
  },
  "birthDate": "1990-01-15",
  "birthPlace": "Москва",
  "passportSeries": "4500",
  "passportNumber": "123456",
  "education": [
    {
      "institution": "МГУ",
      "degree": "Магистратура",
      "fieldOfStudy": "Информатика",
      "startDate": "2008-09-01",
      "endDate": "2013-06-30",
      "current": false
    }
  ],
  "workExperience": [
    {
      "company": "ООО Рога и Копыта",
      "position": "Senior Developer",
      "startDate": "2015-01-01",
      "current": true,
      "responsibilities": "Разработка и поддержка"
    }
  ],
  "consents": {
    "pdnConsent": true,
    "backgroundCheckConsent": true
  },
  "createdAt": "2025-10-06T10:00:00Z",
  "submittedAt": "2025-10-06T14:30:00Z"
}
```
