import { defineStore } from 'pinia';

const STEP = 5n;

const ACTIONS = ['create', 'read', 'update', 'delete', 'notice'];

const SCOPE_DEFINITIONS = [
  { scope: 'user', comment: 'Користувачі' },
  { scope: 'event', comment: 'Календар подій' },
  { scope: 'channel', comment: 'Канали мережі' },
  { scope: 'ipaddress', comment: 'IP-адреси мережі' },
  { scope: 'mailbox', comment: 'Поштові скриньки' },
  { scope: 'request', comment: 'Сервісна підтримка' },
  { scope: 'inspector', comment: 'ПК SysInspector' },
  { scope: 'report', comment: 'Сервісні звіти' },
  { scope: 'organization', comment: 'Організації' },
  { scope: 'subdivision', comment: 'Підрозділи' },
  { scope: 'department', comment: 'Відділи' },
  { scope: 'location', comment: 'Локації' },
  { scope: 'position', comment: 'Посади' },
  { scope: 'device', comment: 'Пристрої' }
];

const SCOPE_ACTION_OFFSET = {
  create: 0n,
  read: 1n,
  update: 2n,
  delete: 3n,
  notice: 4n
};

const BIT_MAP = new Map();

SCOPE_DEFINITIONS.forEach((def, index) => {
  const resourceBit = BigInt(index) * STEP;
  ACTIONS.forEach(action => {
    const offset = SCOPE_ACTION_OFFSET[action];
    BIT_MAP.set(`${def.scope}:${action}`, 1n << (resourceBit + offset));
  });
});

export const useScopeStore = defineStore('scope', () => {
  function deserialize(value) {
    if (!value) return 0n;
    try {
      return typeof value === 'bigint' ? value : BigInt(value);
    } catch {
      return 0n;
    }
  }

  function serialize(mask) {
    return mask.toString();
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
    return SCOPE_DEFINITIONS.map(def => ({
      ...def,
      create: callback(def.scope, 'create'),
      read: callback(def.scope, 'read'),
      update: callback(def.scope, 'update'),
      delete: callback(def.scope, 'delete'),
      notice: callback(def.scope, 'notice')
    }));
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

  function getMaskFromRows(rows = []) {
    let mask = 0n;
    for (const row of rows) {
      for (const action of ACTIONS) {
        if (row[action]) {
          const bit = BIT_MAP.get(`${row.scope}:${action}`);
          if (bit) mask |= bit;
        }
      }
    }
    return mask;
  }

  return {
    SCOPE_DEFINITIONS,
    ACTIONS,
    serialize,
    deserialize,
    toList,
    hasScope,
    hasAnyScope,
    getSelectScope,
    getDefaultScope,
    getCustomScope,
    getMaskFromRows
  };
});
