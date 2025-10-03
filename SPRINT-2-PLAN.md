# Sprint 2: Questionnaire Form - План разработки

## 🎯 Цели Sprint 2

Реализация многошаговой формы анкеты для кандидатов с валидацией, сохранением черновиков и отправкой данных на проверку.

## 📋 User Stories

### US-E2-01: Заполнение анкеты без логина ⭐ Priority 1
**Как** кандидат, **я хочу** открыть ссылку и заполнить анкету по шагам, **чтобы** отправить данные быстро и без регистрации.

**Критерии приемки:**
- [ ] Мастер из 5 шагов: Контакты → Паспорт → Адрес → Образование → Согласия
- [ ] Валидация формата (телефон, email, серия/номер паспорта, дата рождения)
- [ ] Кнопка "Сохранить и продолжить позже" (черновик)
- [ ] При "Отправить" создается/обновляется запись "Физлицо" (status = QuestionnaireSubmitted)
- [ ] Чекбокс-согласия фиксируются

**Acceptance Test:**
```gherkin
Given я открыл ссылку-приглашение
When я заполняю анкету по шагам
And нажимаю "Сохранить черновик" на шаге 3
Then данные сохраняются, я могу вернуться позже
When я возвращаюсь по той же ссылке
Then я вижу сохраненные данные на шаге 3
When я завершаю заполнение и нажимаю "Отправить"
Then статус кандидата меняется на QuestionnaireSubmitted
And я вижу подтверждение отправки
```

### US-E2-02: Генерация PDF анкеты ⭐ Priority 2
**Как** кандидат, **я хочу** получить PDF копию заполненной анкеты, **чтобы** иметь подтверждение отправки.

**Критерии приемки:**
- [ ] После отправки анкеты генерируется PDF
- [ ] PDF содержит все заполненные данные
- [ ] PDF включает подписанные согласия
- [ ] PDF отправляется на email кандидата
- [ ] PDF сохраняется в системе

## 🏗️ Архитектура

### Backend Components

**1. Questionnaire Entity**
```typescript
{
  id: uuid,
  candidateId: uuid,
  status: 'draft' | 'submitted',

  // Step 1: Contacts (из Candidate)

  // Step 2: Passport Data
  passportSeries: string,
  passportNumber: string,
  passportIssuer: string,
  passportIssueDate: Date,
  passportIssuerCode: string,
  birthDate: Date,
  birthPlace: string,

  // Step 3: Address
  registrationAddress: string,
  actualAddress: string,
  actualAddressSameAsRegistration: boolean,

  // Step 4: Education & Experience
  education: jsonb[], // массив образований
  workExperience: jsonb[], // массив опыта работы

  // Step 5: Consents
  consents: jsonb, // { pdnConsent: true, photoConsent: true, ... }

  createdAt: Date,
  updatedAt: Date,
  submittedAt: Date | null
}
```

**2. API Endpoints**
```
# Для кандидатов (по токену)
GET    /api/v1/questionnaire/token/:token          # Получить текущий черновик
POST   /api/v1/questionnaire/token/:token          # Создать/обновить черновик
POST   /api/v1/questionnaire/token/:token/submit   # Отправить анкету
GET    /api/v1/questionnaire/token/:token/pdf      # Скачать PDF

# Для рекрутеров
GET    /api/v1/questionnaires                      # Список всех анкет
GET    /api/v1/questionnaires/:id                  # Детали анкеты
GET    /api/v1/questionnaires/:id/pdf              # PDF анкеты
```

**3. Services**
- `QuestionnaireService` - CRUD операции с анкетами
- `PdfGenerationService` - генерация PDF через Gotenberg
- `ValidationService` - валидация паспортных данных

**4. PDF Template**
- Handlebars шаблон HTML
- Конвертация в PDF через Gotenberg
- Сохранение в MinIO

### Frontend Components

**1. Questionnaire Wizard (`/questionnaire/[token]`)**
```
/questionnaire/[token]
  ├── QuestionnaireWizard.tsx       # Основной компонент wizard
  ├── StepIndicator.tsx             # Индикатор шагов
  ├── Steps/
  │   ├── Step1_Contacts.tsx        # Контакты (pre-filled)
  │   ├── Step2_Passport.tsx        # Паспортные данные
  │   ├── Step3_Address.tsx         # Адреса
  │   ├── Step4_Education.tsx       # Образование и опыт
  │   └── Step5_Consents.tsx        # Согласия
  ├── Navigation.tsx                # Кнопки Назад/Далее/Сохранить
  └── ProgressBar.tsx               # Прогресс заполнения
```

**2. Form State Management**
- Zustand store для состояния wizard
- Auto-save каждые 30 секунд
- Optimistic updates

**3. Validation Schemas (Zod)**
```typescript
// Step 2: Passport
passportSchema = z.object({
  passportSeries: z.string().regex(/^\d{4}$/),
  passportNumber: z.string().regex(/^\d{6}$/),
  passportIssueDate: z.date().max(new Date()),
  birthDate: z.date().max(new Date()),
  // ...
})
```

## 🔧 Технические задачи

### Backend
- [ ] Создать Questionnaire entity с миграцией
- [ ] Реализовать QuestionnaireService
- [ ] Создать endpoints для работы с анкетами
- [ ] Интегрировать Gotenberg для PDF
- [ ] Создать PDF шаблон (Handlebars)
- [ ] Настроить MinIO для хранения PDF
- [ ] Добавить email уведомление с PDF

### Frontend
- [ ] Создать wizard layout
- [ ] Реализовать все 5 шагов формы
- [ ] Добавить валидацию каждого шага
- [ ] Реализовать auto-save функционал
- [ ] Создать progress indicator
- [ ] Добавить маски для полей (паспорт, телефон)
- [ ] Реализовать страницу успешной отправки
- [ ] Добавить возможность скачать PDF

### Infrastructure
- [ ] Убедиться что Gotenberg работает
- [ ] Настроить MinIO bucket для PDF
- [ ] Добавить CORS для скачивания PDF

## 📊 Валидация данных

### Паспортные данные
- **Серия**: 4 цифры (XXXX)
- **Номер**: 6 цифр (XXXXXX)
- **Код подразделения**: 6 цифр (XXX-XXX)
- **Дата выдачи**: не позже текущей даты
- **Дата рождения**: не позже текущей даты, возраст 18+

### Телефон
- Формат: +7 (XXX) XXX-XX-XX
- Валидация российских номеров

### Email
- RFC 5322 стандарт
- Проверка DNS записи (опционально)

### Адрес
- Минимум: город, улица, дом
- Валидация через подсказки (DaData API - опционально)

## 🎨 UI/UX

### Step Indicator
```
[✓] Контакты → [•] Паспорт → [ ] Адрес → [ ] Образование → [ ] Согласия
```

### Progress Bar
```
[████████░░░░░░░░░░░] 40%
```

### Navigation
```
[← Назад]  [Сохранить черновик]  [Далее →]
                                 [Отправить] (на последнем шаге)
```

### Validation Messages
- Real-time валидация при вводе
- Сообщения об ошибках под полем
- Блокировка кнопки "Далее" при ошибках

## 📝 Data Flow

1. **Открытие ссылки:**
   - GET /invitations/public/token/:token
   - Проверка валидности токена
   - Загрузка существующего черновика (если есть)

2. **Заполнение шагов:**
   - Локальное состояние в Zustand
   - Auto-save каждые 30 сек
   - POST /questionnaire/token/:token (partial update)

3. **Отправка анкеты:**
   - Валидация всех шагов
   - POST /questionnaire/token/:token/submit
   - Генерация PDF
   - Отправка email с PDF
   - Обновление статуса кандидата

4. **Подтверждение:**
   - Показ страницы успеха
   - Кнопка скачивания PDF
   - Email с подтверждением

## 🧪 Тестирование

### Unit Tests
- [ ] Validation schemas (Zod)
- [ ] QuestionnaireService методы
- [ ] PDF generation service

### Integration Tests
- [ ] API endpoints
- [ ] Email отправка
- [ ] PDF генерация

### E2E Tests (опционально)
- [ ] Полный flow заполнения анкеты
- [ ] Сохранение и восстановление черновика
- [ ] Отправка и получение PDF

## 📈 Метрики успеха

- Время заполнения анкеты: < 10 минут
- Success rate отправки: > 95%
- PDF генерация: < 3 секунд
- Auto-save latency: < 500ms
- Mobile responsive: 100%

## ⏱️ Оценка времени

- Backend: 2-3 дня
- Frontend: 3-4 дня
- Testing & Polish: 1-2 дня
- **Итого: 6-9 дней**

## 🚀 Definition of Done

- [ ] Все User Stories выполнены
- [ ] Все критерии приемки пройдены
- [ ] Unit тесты написаны и проходят
- [ ] API документация обновлена
- [ ] UI responsive на всех устройствах
- [ ] PDF генерация работает корректно
- [ ] Email отправка настроена
- [ ] Code review пройден
- [ ] Демо функционала проведено

---

**Sprint 2 готов к старту!** 🚀