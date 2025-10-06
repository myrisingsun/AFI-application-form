# PDF Template System - Руководство

## 📋 Обзор

Система генерации PDF использует **Handlebars** шаблоны + **Gotenberg** для конвертации HTML в PDF.

### Преимущества подхода:
- ✅ **Редактируемые шаблоны** - можно менять без изменения кода
- ✅ **Профессиональная верстка** - полный контроль над CSS
- ✅ **Мощные helpers** - 20+ функций форматирования
- ✅ **Версионирование** - шаблоны в Git
- ✅ **Переиспользование** - создавай новые шаблоны для разных документов

## 📁 Структура файлов

```
backend/src/modules/documents/
├── pdf.service.ts                  # Основной сервис PDF генерации
├── helpers/
│   └── template.helpers.ts         # Handlebars helpers (formatDate, defaultValue, и т.д.)
└── templates/
    ├── questionnaire.hbs           # Шаблон анкеты кандидата
    ├── consent.hbs                 # Шаблон согласий (будущее)
    └── contract.hbs                # Шаблон договора (будущее)
```

## 🎨 Создание нового шаблона

### 1. Создай файл шаблона

`backend/src/modules/documents/templates/my-template.hbs`

```handlebars
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <style>
        /* Твои стили здесь */
        @page {
            size: A4;
            margin: 15mm;
        }
        body {
            font-family: 'Times New Roman', serif;
            font-size: 11pt;
        }
    </style>
</head>
<body>
    <h1>{{title}}</h1>
    <p>Дата: {{formatDate date "DD.MM.YYYY"}}</p>

    {{#if items}}
    <ul>
        {{#each items}}
        <li>{{this.name}}</li>
        {{/each}}
    </ul>
    {{/if}}
</body>
</html>
```

### 2. Используй в коде

```typescript
// В любом сервисе
constructor(private pdfService: PdfService) {}

async generateMyPdf(data: MyData): Promise<Buffer> {
  // Handlebars автоматически найдет templates/my-template.hbs
  return this.pdfService.renderTemplate('my-template', data);
}
```

## 🔧 Доступные Helpers

### Форматирование дат

```handlebars
{{formatDate date "DD.MM.YYYY"}}           → 06.10.2025
{{formatDate date "MM.YYYY"}}              → 10.2025
{{formatDate date "DD.MM.YYYY HH:mm:ss"}}  → 06.10.2025 14:30:15
```

### Значения по умолчанию

```handlebars
{{defaultValue value "Не указано"}}
{{defaultValue email "Email не предоставлен"}}
```

### Работа с массивами

```handlebars
{{#if (arrayLength education)}}
  Всего записей: {{arrayLength education}}
  {{#each education}}
    {{increment @index}}. {{this.institution}}
  {{/each}}
{{/if}}
```

### Форматирование телефонов

```handlebars
{{formatPhone "+79991234567"}}  → +7 (999) 123-45-67
```

### Форматирование паспорта

```handlebars
{{formatPassport "4500" "123456"}}    → 4500 123456
{{formatIssuerCode "500123"}}         → 500-123
```

### Текстовые операции

```handlebars
{{capitalize "иванов"}}             → Иванов
{{titleCase "иван петрович"}}        → Иван Петрович
{{firstLetter "Александр"}}          → А
{{truncate longText 50}}             → Первые 50 символов...
```

### Вычисления

```handlebars
{{age birthDate}}                       → 32 (лет)
{{workDuration startDate endDate}}      → 2 года 5 месяцев
```

### Условия

```handlebars
{{#if (eq status "completed")}}
  Завершено
{{else}}
  В процессе
{{/if}}

{{#if (and condition1 condition2)}}
  Оба условия истинны
{{/if}}

{{#if (or condition1 condition2)}}
  Хотя бы одно условие истинно
{{/if}}

{{#if (gt value 100)}}
  Больше 100
{{/if}}
```

### Да/Нет

```handlebars
Согласен: {{yesNo consents.pdnConsent}}  → Да
```

## 📐 CSS стили для печати

### Базовые правила

```css
/* Размер страницы */
@page {
    size: A4;              /* или A4 landscape */
    margin: 15mm;          /* поля страницы */
}

/* Избежать разрыва элемента */
.section {
    page-break-inside: avoid;
}

/* Принудительный разрыв */
.page-break {
    page-break-after: always;
}

/* Печать цветов */
body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
}
```

### Рекомендации по верстке

1. **Шрифты**: используй стандартные (Times New Roman, Arial)
2. **Размер**: 10-12pt для основного текста
3. **Цвета**: учитывай черно-белую печать
4. **Отступы**: минимум 10mm от края страницы
5. **Таблицы**: задавай фиксированную ширину

## 🎯 Примеры использования

### Пример 1: Простой документ

```handlebars
<div class="header">
    <h1>{{title}}</h1>
    <p>№ {{documentNumber}} от {{formatDate createdAt "DD.MM.YYYY"}}</p>
</div>

<div class="content">
    <p>{{description}}</p>
</div>

<div class="footer">
    <p>Подпись: ________________</p>
</div>
```

### Пример 2: Таблица с данными

```handlebars
<table>
    <thead>
        <tr>
            <th>№</th>
            <th>Наименование</th>
            <th>Дата</th>
        </tr>
    </thead>
    <tbody>
        {{#each items}}
        <tr>
            <td>{{increment @index}}</td>
            <td>{{this.name}}</td>
            <td>{{formatDate this.date "DD.MM.YYYY"}}</td>
        </tr>
        {{/each}}
    </tbody>
</table>
```

### Пример 3: Условная логика

```handlebars
{{#if (eq status "submitted")}}
    <div class="status submitted">
        ✓ Анкета отправлена {{formatDate submittedAt "DD.MM.YYYY"}}
    </div>
{{else if (eq status "draft")}}
    <div class="status draft">
        ⚠ Черновик
    </div>
{{else}}
    <div class="status">
        Статус: {{status}}
    </div>
{{/if}}
```

## 🛠️ Создание собственных Helpers

Добавь в `helpers/template.helpers.ts`:

```typescript
export const templateHelpers = {
  // ... существующие helpers

  // Твой новый helper
  myCustomHelper: (value: string): string => {
    // Твоя логика
    return value.toUpperCase();
  },
};
```

Использование:

```handlebars
{{myCustomHelper "text"}}  → TEXT
```

## 📤 Генерация PDF

### В контроллере

```typescript
@Get(':id/pdf')
async downloadPdf(@Param('id') id: string, @Res() res: Response) {
  const data = await this.service.getData(id);
  const pdf = await this.pdfService.generatePdf('my-template', data);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="document-${id}.pdf"`,
  });

  res.send(pdf);
}
```

### Параметры генерации

```typescript
await this.pdfService.generatePdfFromHtml(html, {
  marginTop: '1',      // в дюймах
  marginBottom: '1',
  marginLeft: '0.5',
  marginRight: '0.5',
  paperWidth: '8.27',  // A4 width в дюймах
  paperHeight: '11.69' // A4 height в дюймах
});
```

## 🔍 Отладка шаблонов

### 1. Проверь данные

```typescript
console.log('Template data:', JSON.stringify(data, null, 2));
```

### 2. Проверь HTML

```typescript
const html = this.renderTemplate('my-template', data);
fs.writeFileSync('debug.html', html);  // Сохрани для просмотра в браузере
```

### 3. Проверь шаблон

- Открой .hbs файл в браузере
- Проверь синтаксис Handlebars
- Убедись в наличии закрывающих тегов

## 📝 Чеклист для нового шаблона

- [ ] Создан .hbs файл в `/templates/`
- [ ] Добавлены необходимые стили
- [ ] Использованы только доступные helpers
- [ ] Протестирован с реальными данными
- [ ] Проверена печать/экспорт в PDF
- [ ] Добавлена документация в комментарии
- [ ] Шаблон добавлен в Git

## 🎓 Полезные ссылки

- [Handlebars Documentation](https://handlebarsjs.com/)
- [Gotenberg API](https://gotenberg.dev/)
- [CSS Print Styles](https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/)
- [A4 Paper Dimensions](https://www.papersizes.org/a-paper-sizes.htm)

## 💡 Советы

1. **Тестируй на реальных данных** - используй примеры из БД
2. **Проверяй разные объемы** - 1 запись, 10 записей, пустые данные
3. **Используй переменные для цветов** - легче менять тему
4. **Добавляй комментарии в шаблон** - объясняй сложные части
5. **Версионируй шаблоны** - храни в Git с понятными коммитами

## ⚙️ Настройка Gotenberg (если нужно)

Docker Compose уже настроен, но если нужны изменения:

```yaml
gotenberg:
  image: gotenberg/gotenberg:7
  ports:
    - "3001:3001"
  command:
    - "gotenberg"
    - "--api-port=3001"
```

ENV переменная:
```
GOTENBERG_URL=http://localhost:3001
```
