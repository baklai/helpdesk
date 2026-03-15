import { SCOPE_ACTION_OFFSET, SCOPE_REGISTRY, ScopeAction, ScopeResource } from './config.scope';

export type ScopeInput = Partial<Record<ScopeResource, ScopeAction[]>>;

export type { ScopeAction, ScopeResource };

const BIT_MAP = new Map<string, bigint>();

for (const [resource, entry] of Object.entries(SCOPE_REGISTRY)) {
  for (const [action, offset] of Object.entries(SCOPE_ACTION_OFFSET)) {
    BIT_MAP.set(`${resource}:${action}`, 1n << BigInt(entry.bit + offset));
  }
}

export function serializeScopeMask(mask: bigint): string {
  return mask.toString();
}

export function deserializeScopeMask(value: string | null | undefined): bigint {
  if (!value) return 0n;
  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
}

export function encodeScopeMask(input: ScopeInput): bigint {
  let mask = 0n;
  for (const [resource, actions] of Object.entries(input) as [ScopeResource, ScopeAction[]][]) {
    for (const action of actions) {
      const bit = BIT_MAP.get(`${resource}:${action}`);
      if (bit !== undefined) mask |= bit;
    }
  }
  return mask;
}

export function encodeScopeList(list: string[]): bigint {
  let mask = 0n;
  for (const key of list) {
    const bit = BIT_MAP.get(key);
    if (bit !== undefined) mask |= bit;
  }
  return mask;
}

export function decodeScopeMask(mask: bigint): ScopeInput {
  const result: ScopeInput = {};
  for (const [key, bit] of BIT_MAP.entries()) {
    if ((mask & bit) === bit) {
      const [resource, action] = key.split(':') as [ScopeResource, ScopeAction];
      if (!result[resource]) result[resource] = [];
      result[resource]!.push(action);
    }
  }
  return result;
}

export function decodeScopeToList(scopeStr: string | null | undefined): string[] {
  const mask = deserializeScopeMask(scopeStr);
  const result: string[] = [];
  for (const [key, bit] of BIT_MAP.entries()) {
    if ((mask & bit) === bit) result.push(key);
  }
  return result;
}

export function hasScopes(userMask: bigint, required: ScopeInput): boolean {
  const requiredMask = encodeScopeMask(required);
  if (requiredMask === 0n) return true;
  return (userMask & requiredMask) === requiredMask;
}

export function hasAnyScope(userMask: bigint, required: ScopeInput): boolean {
  const requiredMask = encodeScopeMask(required);
  if (requiredMask === 0n) return true;
  return (userMask & requiredMask) !== 0n;
}

export function getScopeMask(resource: ScopeResource, action: ScopeAction): bigint {
  return BIT_MAP.get(`${resource}:${action}`) ?? 0n;
}
