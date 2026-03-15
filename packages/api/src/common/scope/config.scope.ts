const STEP = 5n;

const RESOURCES = [
  'user',
  'event',
  'channel',
  'ipaddress',
  'mailbox',
  'request',
  'inspector',
  'report',
  'organization',
  'subdivision',
  'department',
  'location',
  'position',
  'device'
] as const;

export const SCOPE_REGISTRY = Object.freeze(
  Object.fromEntries(RESOURCES.map((name, index) => [name, { bit: BigInt(index) * STEP }]))
);
export const SCOPE_ACTION_OFFSET = Object.freeze({
  create: 0n,
  read: 1n,
  update: 2n,
  delete: 3n,
  notice: 4n
} as const);

export type ScopeResource = keyof typeof SCOPE_REGISTRY;

export type ScopeAction = keyof typeof SCOPE_ACTION_OFFSET;

export const SCOPE_RESOURCES = Object.keys(SCOPE_REGISTRY) as ScopeResource[];

export const SCOPE_ACTIONS = Object.keys(SCOPE_ACTION_OFFSET) as ScopeAction[];
