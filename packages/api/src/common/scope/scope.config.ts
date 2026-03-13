export const SCOPE_REGISTRY = Object.freeze({
  event: { bit: 0 },
  channel: { bit: 5 },
  ipaddress: { bit: 10 },
  mailbox: { bit: 15 },
  request: { bit: 20 },
  inspector: { bit: 25 },
  report: { bit: 30 },
  organization: { bit: 35 },
  subdivision: { bit: 40 },
  department: { bit: 45 },
  location: { bit: 50 },
  position: { bit: 55 },
  device: { bit: 60 },
  user: { bit: 65 }
} as const);

export const SCOPE_ACTION_OFFSET = Object.freeze({
  create: 0,
  read: 1,
  update: 2,
  delete: 3,
  notice: 4
} as const);

export type ScopeAction = keyof typeof SCOPE_ACTION_OFFSET;
export type ScopeResource = keyof typeof SCOPE_REGISTRY;

export const SCOPE_RESOURCES = (Object.keys(SCOPE_REGISTRY) as ScopeResource[]).filter(
  r => !('deprecated' in SCOPE_REGISTRY[r])
);

export const SCOPE_ACTIONS = Object.keys(SCOPE_ACTION_OFFSET) as ScopeAction[];
