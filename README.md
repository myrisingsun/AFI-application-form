# AFI Application Form System

Система управления анкетами кандидатов с возможностью проверки службой безопасности и загрузки документов.

## 📊 Статус разработки

**Текущий Sprint:** Sprint 2 ✅ Завершен + Улучшения
**Следующий Sprint:** Sprint 3 (PDF Generation & Email)

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

- **Frontend**: http://localhost:3000 (или 3001 если 3000 занят)
- **Backend API**: http://localhost:5000
- **API Docs (Swagger)**: http://localhost:5000/api/docs
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
JWT_SECRET=your-secret-key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
GOTENBERG_URL=http://localhost:3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 📦 Модули системы

### Backend (NestJS)
- **Auth**: JWT аутентификация с ролями (Admin, Recruiter, Security, Viewer)
- **Candidates**: Управление кандидатами и их статусами
- **Invitations**: Генерация и отправка приглашений, управление токенами
- **Questionnaire**: 5-шаговая анкета с валидацией и auto-save
- **Email**: Отправка уведомлений через Nodemailer + Handlebars
- **Documents**: Загрузка и обработка документов (MinIO)
- **Security-Check**: Интеграция с СБ (планируется)
- **Consents**: Согласия и PDF генерация (Gotenberg)
- **Reports**: Отчеты и экспорт (планируется)

### Frontend (Next.js)
- **Dashboard**: Панель управления для рекрутеров
- **Invitations UI**: Создание, просмотр и управление приглашениями
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

## 🎯 Основные функции

1. **Управление приглашениями**: Создание персональных ссылок для кандидатов
2. **Анкета кандидата**: Многошаговая форма с валидацией
3. **Проверка СБ**: Автоматическая отправка данных в службу безопасности
4. **Загрузка документов**: Drag & Drop загрузка с классификацией
5. **OCR обработка**: Извлечение данных из документов
6. **PDF генерация**: Создание согласий с подстановкой данных
7. **Интеграция 1С**: Передача готовых данных в учетную систему

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