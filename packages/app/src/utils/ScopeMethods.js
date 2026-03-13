/**
 * Реєстр скоупів із фіксованими позиціями бітів.
 *
 * ПРАВИЛА:
 *  - "bit" — незмінна позиція назавжди, прив'язана до ресурсу, не до масиву.
 *  - Нові ресурси додавати ТІЛЬКИ в кінець із наступним вільним base.
 *  - Змінювати або видаляти існуючі "bit" ЗАБОРОНЕНО — це інвалідує БД.
 *  - При видаленні ресурсу: додати deprecated: true, запис залишається.
 *
 *  Ресурс         | Біти (base .. base+4)
 *  ───────────────|──────────────────────
 *  event          |  0 ..  4
 *  channel        |  5 ..  9
 *  ipaddress      | 10 .. 14
 *  mailbox        | 15 .. 19
 *  request        | 20 .. 24
 *  inspector      | 25 .. 29
 *  report         | 30 .. 34
 *  organization   | 35 .. 39
 *  subdivision    | 40 .. 44
 *  department     | 45 .. 49
 *  location       | 50 .. 54
 *  position       | 55 .. 59
 *  device         | 60 .. 64
 *  user           | 65 .. 69
 *  notice         | 70 .. 74
 *  ── наступний вільний base = 75 ──
 */
const SCOPE_REGISTRY = Object.freeze({
  event:        { bit: 0  },
  channel:      { bit: 5  },
  ipaddress:    { bit: 10 },
  mailbox:      { bit: 15 },
  request:      { bit: 20 },
  inspector:    { bit: 25 },
  report:       { bit: 30 },
  organization: { bit: 35 },
  subdivision:  { bit: 40 },
  department:   { bit: 45 },
  location:     { bit: 50 },
  position:     { bit: 55 },
  device:       { bit: 60 },
  user:         { bit: 65 },
  notice:       { bit: 70 },
  // ── НОВІ РЕСУРСИ ДОДАВАТИ ТІЛЬКИ ТУТ ──
});

const SCOPE_ACTION_OFFSET = Object.freeze({
  create: 0,
  read:   1,
  update: 2,
  delete: 3,
  notice: 4,
});

/**
 * Карта: 'resource:action' → BigInt-біт.
 * Позиція кожного біта визначається реєстром, а не порядком масиву.
 */
const BIT_MAP = new Map();

for (const [resource, entry] of Object.entries(SCOPE_REGISTRY)) {
  if ('deprecated' in entry) continue;
  for (const [action, offset] of Object.entries(SCOPE_ACTION_OFFSET)) {
    BIT_MAP.set(`${resource}:${action}`, 1n << BigInt(entry.bit + offset));
  }
}

export function deserializeScopeMask(value) {
  if (!value) return 0n;
  try { return BigInt(value); } catch { return 0n; }
}

export function encodeScopeList(list) {
  let mask = 0n;
  for (const key of list) {
    const bit = BIT_MAP.get(key);
    if (bit !== undefined) mask |= bit;
  }
  return mask;
}

export function decodeScopeToList(scopeStr) {
  const mask = deserializeScopeMask(scopeStr);
  const result = [];
  for (const [key, bit] of BIT_MAP.entries()) {
    if ((mask & bit) === bit) result.push(key);
  }
  return result;
}

export function hasScope(scopeStr, permission) {
  const mask = deserializeScopeMask(scopeStr);
  if (mask === 0n) return false;
  const bit = BIT_MAP.get(permission);
  if (bit === undefined) return false;
  return (mask & bit) === bit;
}

export function hasAnyScope(scopeStr, permissions) {
  return permissions.some(p => hasScope(scopeStr, p));
}

export function hasAllScopes(scopeStr, permissions) {
  return permissions.every(p => hasScope(scopeStr, p));
}
