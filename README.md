# AFI Application Form System

Система управления анкетами кандидатов с возможностью проверки службой безопасности и загрузки документов.

## 📊 Статус разработки

**Текущий Sprint:** Sprint 3 ✅ Завершен (PDF Generation)
**Следующий Sprint:** Sprint 4 (Consents & Documents Upload)

### Выполненные спринты:
- ✅ **Sprint 0**: Инфраструктура и базовая настройка
- ✅ **Sprint 1**: Invitation Management System
  - Генерация и отправка приглашений
  - Email уведомления
  - Управление статусами
  - [Подробнее в SPRINT-1-SUMMARY.md](./SPRINT-1-SUMMARY.md)
- ✅ **Sprint 2**: Questionnaire Form (5-step Wizard)
  - Многошаговая форма анкеты (5 шагов)
  - Валидация данных (паспорт, адреса, образование)
  - Auto-save черновиков (каждые 30 сек)
  - Динамические массивы (образование, опыт работы)
  - [Подробнее в SPRINT-2-SUMMARY.md](./SPRINT-2-SUMMARY.md)
- ✅ **Sprint 2.1**: Улучшения интерфейса рекрутера
  - Отображение и копирование токенов приглашений
  - Управление статусами приглашений (активация/закрытие)
  - Исправления валидации адресов и дат в анкете
- ✅ **Sprint 2.2**: Управление анкетами и приглашениями
  - Просмотр списка всех анкет с поиском и фильтрацией
  - Детальный просмотр анкет кандидатов
  - Удаление анкет рекрутером
  - Удаление приглашений (любой статус)
  - Отображение токенов приглашений в списке анкет
  - Экспорт анкет в PDF формат
- ✅ **Sprint 3**: PDF Generation System
  - Handlebars шаблонная система с 22+ хелперами для форматирования
  - Интеграция с Gotenberg для HTML → PDF конвертации
  - Профессиональный шаблон questionnaire.hbs с CSS для печати
  - Workaround для Windows/Docker networking через curl
  - API endpoint для скачивания PDF анкет
  - Автоматическая очистка временных файлов

## 🏗️ Архитектура

**Backend**: NestJS + TypeScript + PostgreSQL + Redis
**Frontend**: Next.js + TypeScript + Tailwind CSS + shadcn/ui
**Инфраструктура**: Docker + Gotenberg (PDF) + MinIO (файлы) + MailHog (email)

## 🚀 Быстрый старт

### Разработка (Development)

1. **Backend:**
```bash
cd backend
npm install
npm run start:dev
```

2. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

> **База данных:** Проект использует внешний PostgreSQL на `185.244.219.128:5432`. Данные подключения уже настроены в коде.

### Доступ к системе

**Тестовые учетные записи:**
- Email: `admin@afi.com` / Password: `admin123` (роль: Admin)
- Email: `recruiter@afi.com` / Password: `recruiter123` (роль: Recruiter)

### Продакшн (Production)

```bash
docker-compose up -d
```

## 📋 Доступные URL

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs (Swagger)**: http://localhost:5000/api/docs
- **Gotenberg PDF Service**: http://localhost:3002
- **MailHog UI**: http://localhost:8025
- **MinIO Console**: http://localhost:9001
- **Database**: PostgreSQL на `185.244.219.128:5432`
  - Database: `afi-application-form`
  - User: `afi_applicationform`
  - Password: `run123`

## 🔧 Переменные окружения

### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=afi_user
DB_PASSWORD=afi_pass
DB_DATABASE=afi_app
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=afi_redis_pass
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=afi_minio_user
MINIO_SECRET_KEY=afi_minio_pass
MINIO_BUCKET=afi-documents
GOTENBERG_URL=http://localhost:3002
MAIL_HOST=localhost
MAIL_PORT=1025
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 📦 Модули системы

### Backend (NestJS)
- **Auth**: JWT аутентификация с ролями (Admin, Recruiter, Security, Viewer)
- **Candidates**: Управление кандидатами и их статусами
- **Invitations**: Генерация и отправка приглашений, управление токенами, удаление
- **Questionnaire**: 5-шаговая анкета с валидацией, auto-save, удаление, PDF экспорт
- **Email**: Отправка уведомлений через Nodemailer + Handlebars
- **Documents**: Загрузка и обработка документов (MinIO), PDF генерация (Gotenberg)
  - Handlebars шаблонная система
  - 22+ хелпера для форматирования данных
  - Автоматическая генерация PDF анкет
  - Workaround для Windows/Docker networking
- **Security-Check**: Интеграция с СБ (планируется)
- **Consents**: Согласия и PDF генерация (планируется)
- **Reports**: Отчеты и экспорт (планируется)

### Frontend (Next.js)
- **Dashboard**: Панель управления для рекрутеров
- **Invitations UI**: Создание, просмотр, управление и удаление приглашений
- **Questionnaires UI**: Просмотр списка анкет, детальный просмотр, удаление, PDF экспорт
- **Questionnaire Wizard**: Многошаговая форма анкеты
- **UI Components**: shadcn/ui компоненты
- **Forms**: React Hook Form + Zod валидация
- **API Client**: Axios с JWT interceptors

## 🔐 Роли пользователей

- **Admin**: Полный доступ к системе
- **Recruiter**: Управление кандидатами и приглашениями
- **Security**: Просмотр анкет для проверки
- **Viewer**: Только просмотр

## 🛠️ Команды разработки

### Backend
```bash
npm run start:dev      # Запуск в режиме разработки
npm run build          # Сборка проекта
npm run lint           # Проверка кода
npm run test           # Запуск тестов
```

### Frontend
```bash
npm run dev            # Запуск в режиме разработки
npm run build          # Сборка проекта
npm run start          # Запуск продакшн версии
npm run lint           # Проверка кода
```

## 📊 План разработки

### ✅ Завершенные этапы:

**Sprint 0: Инфраструктура**
- NestJS backend с модульной архитектурой
- Next.js frontend с современным стеком
- Docker контейнеризация
- JWT аутентификация
- Базовые entity и API

**Sprint 1: Система приглашений**
- Генерация токенов приглашений
- Email уведомления с Handlebars шаблонами
- Отслеживание статусов (pending → sent → opened → completed)
- Dashboard для рекрутеров

**Sprint 2: Форма анкеты**
- 5-шаговый wizard (Контакты → Паспорт → Адрес → Образование → Согласия)
- Валидация с Zod schemas
- Auto-save каждые 30 секунд
- Динамические массивы для образования и опыта

**Sprint 2.1: UI/UX улучшения**
- Отображение токенов с копированием
- Управление статусами приглашений
- Исправления валидации форм

**Sprint 2.2: Управление анкетами**
- Список всех анкет с поиском по ФИО и email
- Страница детального просмотра анкеты
- Удаление анкет и приглашений
- Отображение токенов приглашений в списке анкет
- Экспорт анкет в PDF формат

**Sprint 3: PDF Generation System**
- Handlebars шаблонная система с 22+ хелперами
- Интеграция с Gotenberg для HTML → PDF
- Профессиональный шаблон questionnaire.hbs
- API endpoint GET /api/v1/questionnaires/:id/pdf
- Workaround для Windows/Docker networking
- Автоматическая очистка временных файлов

## 🎯 Основные функции

1. **Управление приглашениями**:
   - Создание персональных ссылок для кандидатов
   - Отправка email приглашений
   - Отслеживание статусов (pending → sent → opened → completed)
   - Управление статусами и удаление приглашений

2. **Управление анкетами**:
   - Просмотр списка всех анкет с поиском и фильтрацией
   - Детальный просмотр данных кандидата
   - **Генерация и скачивание PDF анкет** (158KB, 2 страницы, профессиональный дизайн)
   - Удаление анкет
   - Привязка анкет к токенам приглашений

3. **Анкета кандидата**:
   - Многошаговая форма (5 шагов) с валидацией
   - Автосохранение каждые 30 секунд
   - Динамические разделы (образование, опыт работы)

4. **PDF генерация**:
   - Автоматическая генерация PDF анкет с форматированием
   - Handlebars шаблоны с хелперами для дат, телефонов, адресов
   - Профессиональный дизайн с CSS для печати
   - Экспорт через API endpoint

5. **Проверка СБ**: Автоматическая отправка данных в службу безопасности (планируется)
6. **Загрузка документов**: Drag & Drop загрузка с классификацией (планируется)
7. **OCR обработка**: Извлечение данных из документов (планируется)
8. **Интеграция 1С**: Передача готовых данных в учетную систему (планируется)

## 🔒 Безопасность

- JWT токены с refresh механизмом
- Роли и права доступа (RBAC)
- Валидация данных на всех уровнях
- Шифрование чувствительных полей
- Аудит всех действий пользователей
- CORS и CSRF защита

## 📈 Масштабируемость

- Очереди задач через Redis + BullMQ
- Горизонтальное масштабирование контейнеров
- Кеширование API запросов
- Оптимизация запросов к БД
- CDN для статических файлов

## 🧪 Тестирование

```bash
# Backend тесты
cd backend && npm test

# Frontend тесты
cd frontend && npm test

# E2E тесты
npm run test:e2e
```

## 📝 API Документация

Swagger документация доступна по адресу: http://localhost:5000/api/docs

## 🐛 Отладка

- **Backend логи**: `docker-compose logs backend`
- **Frontend логи**: `docker-compose logs frontend`
- **База данных**: Подключение через любой PostgreSQL клиент
- **Email тестирование**: MailHog UI на порту 8025

## 📞 Поддержка

При возникновении вопросов обращайтесь к документации в CLAUDE.md или создавайте issues в репозитории.