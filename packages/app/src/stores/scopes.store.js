import { defineStore } from 'pinia';

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

const SCOPE_ACTIONS = ['create', 'read', 'update', 'delete', 'notice'];

function buildScopeRows(defaultValue = false) {
  return SCOPE_DEFINITIONS.map(({ scope, comment }) => ({
    scope,
    comment,
    create: defaultValue,
    read: defaultValue,
    update: defaultValue,
    delete: defaultValue,
    notice: defaultValue
  }));
}

export const useScopeStore = defineStore('scope', () => {
  function scopeLength() {
    return SCOPE_DEFINITIONS.length * SCOPE_ACTIONS.length;
  }

  function getDefaultScope() {
    return SCOPE_DEFINITIONS.map(({ scope, comment }) => ({
      scope,
      comment,
      create: false,
      read: true,
      update: false,
      delete: false,
      notice: false
    }));
  }

  function getSelectScope(select = false) {
    return buildScopeRows(select);
  }

  function getCustomScope(scopeList = []) {
    const set = new Set(scopeList);
    return SCOPE_DEFINITIONS.map(({ scope, comment }) => ({
      scope,
      comment,
      create: set.has(`${scope}:create`),
      read: set.has(`${scope}:read`),
      update: set.has(`${scope}:update`),
      delete: set.has(`${scope}:delete`),
      notice: set.has(`${scope}:notice`)
    }));
  }

  function getScopeKeyList(rows = []) {
    const result = [];
    for (const row of rows) {
      for (const action of SCOPE_ACTIONS) {
        if (row[action] === true) {
          result.push(`${row.scope}:${action}`);
        }
      }
    }
    return result;
  }

  return {
    scopeLength,
    getDefaultScope,
    getSelectScope,
    getCustomScope,
    getScopeKeyList
  };
});
