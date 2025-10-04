# AFI Application Form System

Система управления анкетами кандидатов с возможностью проверки службой безопасности и загрузки документов.

## 📊 Статус разработки

**Текущий Sprint:** Sprint 2 ✅ Завершен
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

## 🏗️ Архитектура

**Backend**: NestJS + TypeScript + PostgreSQL + Redis
**Frontend**: Next.js + TypeScript + Tailwind CSS + shadcn/ui
**Инфраструктура**: Docker + Gotenberg (PDF) + MinIO (файлы) + MailHog (email)

## 🚀 Быстрый старт

### Разработка (Development) - Sprint 1

1. **Запуск инфраструктуры:**
```bash
docker-compose -f docker-compose.dev.yml up -d postgres redis minio mailhog gotenberg
```

2. **Backend (Simplified - без БД):**
```bash
cd backend
npm install
npm run start:simple
```

3. **Frontend:**
```bash
cd frontend
npm install
npm run dev
```

> **Примечание:** Simplified mode использует in-memory хранилище и не требует подключения к БД. Для полного функционала с persistence используйте `npm run start:dev` после настройки PostgreSQL.

### Продакшн (Production)

```bash
docker-compose up -d
```

## 📋 Доступные URL

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Docs**: http://localhost:5000/api/docs
- **MailHog UI**: http://localhost:8025
- **MinIO Console**: http://localhost:9001

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
- **Auth**: JWT аутентификация с ролями
- **Candidates**: Управление кандидатами
- **Invitations**: Система приглашений
- **Documents**: Загрузка и обработка документов
- **Notifications**: Email уведомления
- **Security-Check**: Интеграция с СБ
- **Consents**: Согласия и PDF генерация
- **Reports**: Отчеты и экспорт

### Frontend (Next.js)
- **UI Components**: shadcn/ui компоненты
- **Forms**: React Hook Form + Zod валидация
- **State**: Zustand + React Query
- **API Client**: Axios с перехватчиками

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

### ✅ Sprint 0: Инфраструктура (Завершен)
- NestJS backend с модульной архитектурой
- Next.js frontend с современным стеком
- Docker контейнеризация
- JWT аутентификация
- Базовые entity и API

### 🔄 Sprint 1: Приглашения (Следующий)
- Система создания приглашений
- Email рассылка
- Валидация токенов
- Админ панель для рекрутеров

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