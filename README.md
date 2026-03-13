# HELPDESK (Cервісна підтримка)

Helpdesk — сервіс підтримки, що надає оперативну допомогу користувачам у вирішенні ІТ-інцидентів та запитів, забезпечуючи швидке відновлення роботи систем і сервісів

## Передумови

- Docker - [Завантажте та встановіть Docker](https://docs.docker.com/engine/install/).

## Змінні проекту `.env`

| Key                      | Comment                                                                 |
| ------------------------ | ----------------------------------------------------------------------- |
| `PORT`                   | Порт сервісу (необов'язково, за замовчуванням 3000)                     |
| `HOST`                   | Хост сервісу (необов'язково, за замовчуванням 127.0.0.1)                |
| `MONGO_URI`              | Рядок підключення до бази даних MongoDB                                 |
| `CORS_ORIGIN`            | Дозволене джерело для міжсайтових запитів (CORS)                        |
| `BCRYPT_SALT`            | Кількість раундів хешування bcrypt (необов'язково, за замовчуванням 10) |
| `JWT_ACCESS_SECRET`      | Секретний ключ для підпису access-токена                                |
| `JWT_ACCESS_EXPIRES_IN`  | Термін дії access-токена (необов'язково, за замовчуванням 15m)          |
| `JWT_REFRESH_SECRET`     | Секретний ключ для підпису refresh-токена                               |
| `JWT_REFRESH_EXPIRES_IN` | Термін дії refresh-токена (необов'язково, за замовчуванням 7d)          |
| `VITE_APP_BASE_URL`      | Базова URL-адреса додатку                                               |
| `VITE_API_BASE_URL`      | Базова URL-адреса API додатку                                           |

### Перевікра з [ESLint](https://eslint.org/)

```bash
npm run lint
```

### Формат з [Prettier](https://prettier.io/)

```bash
npm run format
```

## Конфігураційний файл для Docker Compose `compose.yaml`

```bash
services:
  app:
    image: baklai/helpdesk:latest
    env_file: .env
    environment:
      - NODE_ENV=production
    ports:
      - 3000:3000
    volumes:
      - ./certs:/app/certs
    restart: unless-stopped
    container_name: helpdesk
```

```bash
services:
  app:
    image: baklai/helpdesk:latest
    network_mode: host
    env_file: .env
    environment:
      - NODE_ENV=production
    volumes:
      - ./certs:/app/certs
    restart: unless-stopped
    container_name: helpdesk
```

### Запустіть додаток

```bash
docker compose up -d
```

### Логи додатку

```bash
docker logs --tail 50 -f helpdesk
```

### Перезапустити додаток

```bash
docker compose down && docker rmi baklai/helpdesk && docker compose up -d && docker logs -f helpdesk
```

### Видалити додаток

```bash
docker compose down
```

Після запуску програми на порту (3000 за замовчуванням) ви можете відкрити
у службу підтримки, ввівши http://localhost:3000/.

## Створюйте образи Docker

### Використовуйте реєстр Docker

```bash
docker login
```

### Створення образу Docker

```bash
docker compose build
```

### Створюйте мультиплатформенні образи докерів і надсилайте зображення до репозиторію

```bash
docker compose build --builder multibuilder --no-cache --push
```

Якщо ваша середовище використовує іншу архітектуру ЦП, ніж ваша розробка
(наприклад, ви використовуєте Mac M1, а ваш хмарний постачальник amd64),
ви захочете створити образ для цієї платформи, наприклад:

```bash
# Переконайтеся, що у вас встановлено buildx. Якщо він не встановлений, встановіть його наступним чином
docker buildx install

# Збірка та перехід на buildx builder
docker buildx create --platform linux/amd64,linux/i386,linux/arm/v5,linux/arm/v6,linux/arm/v7,linux/arm64,linux/ppc64le,linux/s390x --name multibuilder --use

# Запустіть екземпляр конструктора
docker buildx inspect --bootstrap
```
