# Настройка Proxifier для локальной разработки

## Проблема
Proxifier перехватывает весь HTTP трафик, включая localhost соединения, что приводит к "Empty reply from server".

## Решение: Исключения в Proxifier

### 1. Исключить localhost адреса
В Proxifier -> Profile -> Proxification Rules -> Add Rule:
- **Name:** Localhost Bypass
- **Targets:** localhost; 127.0.0.1; ::1
- **Action:** Direct (не через proxy)

### 2. Исключить порты разработки
Добавить правило:
- **Name:** Development Ports
- **Targets:** 127.0.0.1:3000; 127.0.0.1:5000; 127.0.0.1:3333
- **Action:** Direct

### 3. Исключить Node.js процессы
В Applications -> Add:
- **Name:** Node.js Development
- **Path:** C:\Program Files\nodejs\node.exe (путь к node.exe)
- **Action:** Direct

### 4. Порядок правил важен!
Убедитесь что правила localhost идут ВЫШЕ общих proxy правил.

## Альтернативный способ

### Временное отключение для разработки:
1. Proxifier -> Profile -> Active Profile -> [None]
2. Или File -> Exit для полной остановки
3. После тестирования - включить обратно

## Проверка
После настройки проверьте:
```bash
curl http://localhost:5000/api/v1/health
```

Должен вернуть JSON ответ вместо "Empty reply from server".