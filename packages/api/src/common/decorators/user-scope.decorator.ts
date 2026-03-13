import { SetMetadata } from '@nestjs/common';

import { ScopeInput } from 'src/common/scope/scope.bitmask';

export const SCOPE_KEY = 'USER_SCOPE';

export const Scope = (input: ScopeInput) => SetMetadata(SCOPE_KEY, input);
