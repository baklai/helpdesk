import { defineStore } from 'pinia';

const STEP = 5n;

const ACTION_DEFINITIONS = [
  { key: 'create', icon: 'pi pi-plus-circle', comment: 'Створення' },
  { key: 'read', icon: 'pi pi-eye', comment: 'Перегляд' },
  { key: 'update', icon: 'pi pi-pencil', comment: 'Редагування' },
  { key: 'delete', icon: 'pi pi-trash', comment: 'Видалення' },
  { key: 'notice', icon: 'pi pi-bell', comment: 'Сповіщення' }
];

const SCOPE_DEFINITIONS = [
  { key: 'user', comment: 'Користувачі' },
  { key: 'event', comment: 'Календар подій' },
  { key: 'channel', comment: 'Канали мережі' },
  { key: 'ipaddress', comment: 'IP-адреси мережі' },
  { key: 'mailbox', comment: 'Поштові скриньки' },
  { key: 'request', comment: 'Сервісна підтримка' },
  { key: 'inspector', comment: 'ПК SysInspector' },
  { key: 'report', comment: 'Сервісні звіти' },
  { key: 'organization', comment: 'Організації' },
  { key: 'subdivision', comment: 'Підрозділи' },
  { key: 'department', comment: 'Відділи' },
  { key: 'location', comment: 'Локації' },
  { key: 'position', comment: 'Посади' },
  { key: 'device', comment: 'Пристрої' }
];

const SCOPE_ACTION_OFFSET = {
  create: 0n,
  read: 1n,
  update: 2n,
  delete: 3n,
  notice: 4n
};

const BIT_MAP = new Map();

for (let i = 0; i < SCOPE_DEFINITIONS.length; i++) {
  const scope = SCOPE_DEFINITIONS[i];
  const base = BigInt(i) * STEP;
  for (const action of ACTION_DEFINITIONS) {
    const offset = SCOPE_ACTION_OFFSET[action.key];
    const bit = 1n << (base + offset);
    BIT_MAP.set(`${scope.key}:${action.key}`, bit);
  }
}

export const useScopeStore = defineStore('scope', () => {
  function count() {
    return ACTION_DEFINITIONS.length * SCOPE_DEFINITIONS.length;
  }

  function serialize(mask) {
    return mask.toString();
  }

  function deserialize(value) {
    if (!value) return 0n;
    try {
      return typeof value === 'bigint' ? value : BigInt(value);
    } catch {
      return 0n;
    }
  }

  function hasScope(userMask, permission) {
    const mask = deserialize(userMask);
    const bit = BIT_MAP.get(permission);
    return bit !== undefined && (mask & bit) === bit;
  }

  function hasAnyScope(userMask, permissions = []) {
    const mask = deserialize(userMask);
    return permissions.some(p => hasScope(mask, p));
  }

  function toList(maskStr) {
    const mask = deserialize(maskStr);
    const result = [];
    for (const [key, bit] of BIT_MAP.entries()) {
      if ((mask & bit) === bit) result.push(key);
    }
    return result;
  }

  function _buildRows(callback) {
    return SCOPE_DEFINITIONS.map(scope => ({
      ...scope,
      create: callback(scope.key, 'create'),
      read: callback(scope.key, 'read'),
      update: callback(scope.key, 'update'),
      delete: callback(scope.key, 'delete'),
      notice: callback(scope.key, 'notice')
    }));
  }

  function getScopeLength(maskStr) {
    return toList(maskStr).length ?? 0;
  }

  function getSelectScope(value = false) {
    return _buildRows(() => value);
  }

  function getDefaultScope() {
    return _buildRows((_, action) => action === 'read');
  }

  function getCustomScope(maskStr) {
    const mask = deserialize(maskStr);
    return _buildRows((scope, action) => {
      const bit = BIT_MAP.get(`${scope}:${action}`);
      return (mask & bit) === bit;
    });
  }

  function getMaskFromRows(scopes = []) {
    let mask = 0n;
    for (const scope of scopes) {
      for (const action of ACTION_DEFINITIONS) {
        if (scope[action.key]) {
          const bit = BIT_MAP.get(`${scope.key}:${action.key}`);
          if (bit) mask |= bit;
        }
      }
    }
    return mask;
  }

  return {
    SCOPE_DEFINITIONS,
    ACTION_DEFINITIONS,
    count,
    serialize,
    deserialize,
    toList,
    hasScope,
    hasAnyScope,
    getScopeLength,
    getSelectScope,
    getDefaultScope,
    getCustomScope,
    getMaskFromRows
  };
});
