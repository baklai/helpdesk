# BaseCrudService

`BaseCrudService` — абстрактний дженерик-сервіс, від якого наслідуються всі модульні сервіси у проекті. Він інкапсулює стандартні CRUD-операції та вирішує проблему N+1 через DataLoader.

## Розташування

```
src/common/services/base.service.ts
```

## Сигнатура

```typescript
export abstract class BaseCrudService<
  TDocument extends Document,
  TEntity,
  TCreateInput,
  TUpdateInput
>
```

### Дженерик-параметри

| Параметр       | Опис                             |
| -------------- | -------------------------------- |
| `TDocument`    | Mongoose-документ (з `Document`) |
| `TEntity`      | GraphQL-сутність (ObjectType)    |
| `TCreateInput` | DTO для створення запису         |
| `TUpdateInput` | DTO для оновлення запису         |

## Методи

### `create(input: TCreateInput): Promise<TEntity>`

Створює новий запис у базі даних.

**Помилки:**

- `BadRequestException` — якщо порушено унікальний індекс (MongoDB код 11000)
- `UnprocessableEntityException` — при інших помилках збереження

```typescript
const result = await this.channelsService.create({ name: 'Канал 1', ... });
```

---

### `findAll(): Promise<TEntity[]>`

Повертає всі записи колекції без фільтрації та пагінації.

```typescript
const locations = await this.locationsService.findAll();
```

---

### `findOneById(id: string): Promise<TEntity>`

Шукає запис за MongoDB ObjectId.

**Помилки:**

- `BadRequestException` — якщо `id` не є валідним ObjectId
- `NotFoundException` — якщо запис не знайдено

```typescript
const device = await this.devicesService.findOneById('64a1b2c3d4e5f6a7b8c9d0e1');
```

---

### `findAllByIds(ids: string[]): Promise<TEntity[]>`

Пакетний пошук за масивом ID. Використовується внутрішньо у DataLoader.

```typescript
const devices = await this.devicesService.findAllByIds(['id1', 'id2', 'id3']);
```

---

### `load(id: Types.ObjectId | string | null | undefined): Promise<TEntity | null>`

Завантажує запис через DataLoader. Декілька викликів `load()` в межах одного тіку event loop об'єднуються в один батч-запит до MongoDB — це вирішує проблему N+1 у GraphQL-резолверах.

```typescript
// У @ResolveField резолвері — виклики автоматично батчуються
const location = await this.locationsService.load(ipaddress.locationId);
```

---

### `updateOneById(id: string, input: TUpdateInput): Promise<TEntity>`

Оновлює запис за ID через `$set`. Повертає оновлену версію документа.

**Помилки:**

- `BadRequestException` — якщо `id` невалідний або порушено унікальний індекс
- `NotFoundException` — якщо запис не знайдено
- `UnprocessableEntityException` — при інших помилках

```typescript
const updated = await this.departmentsService.updateOneById(id, { name: 'Новий відділ' });
```

---

### `removeOneById(id: string): Promise<TEntity>`

Видаляє запис за ID. Повертає видалений документ.

**Помилки:**

- `BadRequestException` — якщо `id` невалідний
- `NotFoundException` — якщо запис не знайдено

```typescript
const deleted = await this.positionsService.removeOneById(id);
```

## Наслідування

```typescript
@Injectable()
export class ChannelsService extends BaseCrudService<
  ChannelDocument,
  ChannelEntity,
  CreateChannelInput,
  UpdateChannelInput
> {
  constructor(@InjectModel(Channel.name) private readonly channelModel: Model<ChannelDocument>) {
    super(channelModel);
  }

  // Додаткові методи специфічні для каналів...
}
```

## Обробка помилок

Сервіс дотримується єдиного паттерну обробки помилок:

```typescript
// Помилки бази даних — в try/catch
try {
  result = await this.model.findByIdAndUpdate(...);
} catch (error: any) {
  if (error.code === 11000) {
    throw new BadRequestException('Запис з такими даними вже існує');
  }
  throw new UnprocessableEntityException('Не вдалося оновити запис');
}

// Перевірка результату — після try/catch
if (!result) {
  throw new NotFoundException('Запис не знайдено');
}
```

Такий підхід гарантує, що `NotFoundException` ніколи не буде поглинута блоком `catch`.
