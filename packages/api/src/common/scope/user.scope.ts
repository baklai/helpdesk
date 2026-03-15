import * as Bitmask from './bitmask.scope';
import {
  SCOPE_ACTION_OFFSET,
  SCOPE_ACTIONS,
  SCOPE_REGISTRY,
  SCOPE_RESOURCES
} from './config.scope';

export type { ScopeAction, ScopeInput, ScopeResource } from './bitmask.scope';

export { SCOPE_ACTION_OFFSET, SCOPE_ACTIONS, SCOPE_REGISTRY, SCOPE_RESOURCES };

export const UserScope = {
  encode: Bitmask.encodeScopeMask,
  decode: Bitmask.decodeScopeMask,

  toList: Bitmask.decodeScopeToList,
  fromList: Bitmask.encodeScopeList,

  serialize: Bitmask.serializeScopeMask,
  deserialize: Bitmask.deserializeScopeMask,

  has: Bitmask.hasScopes,
  hasAny: Bitmask.hasAnyScope,

  getBit: Bitmask.getScopeMask
};
