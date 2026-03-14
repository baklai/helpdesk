# Встановлення та запуск

## Вимоги

- **Node.js** >= 18
- **MongoDB** >= 6
- **npm** >= 9

## Клонування репозиторію

```bash
git clone <repo-url>
cd helpdesk
```

## Налаштування API

### Змінні середовища

Створіть файл `packages/api/.env` на основі наступного шаблону:

```env
# Сервер
PORT=3000
HOST=localhost
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/helpdesk

# JWT токени
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_EXPIRES_IN=7d

# Bcrypt
BCRYPT_SALT=10
```

### Запуск API

```bash
cd packages/api

# Встановлення залежностей
npm install

# Режим розробки (з hot-reload)
npm run dev

# Продакшн збірка
npm run build
npm run prod
```

API буде доступне за адресою: `http://localhost:3000/api`

GraphQL Playground (тільки в dev-режимі): `http://localhost:3000/api`

## Налаштування App

### Змінні середовища

Створіть файл `packages/app/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Запуск App

```bash
cd packages/app

# Встановлення залежностей
npm install

# Режим розробки
npm run dev

# Продакшн збірка
npm run build
```

Застосунок буде доступний за адресою: `http://localhost:5173/helpdesk`

## Запуск документації

```bash
cd packages/docs

npm install
npm run dev
```

Документація: `http://localhost:5173`

## Перший запуск

Після старту системи необхідно зареєструвати першого адміністратора через сторінку `/signup`. Після реєстрації обліковий запис матиме статус `pending` — його потрібно активувати та призначити роль `admin` напряму в базі даних MongoDB:

```javascript
// В MongoDB shell або Compass
db.users.updateOne({ email: 'admin@example.com' }, { $set: { status: 'active', role: 'admin' } });
```
