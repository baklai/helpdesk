import { SetMetadata } from '@nestjs/common';

import { type ScopeInput } from 'src/common/scope/user.scope';

export const SCOPE_KEY = 'USER_SCOPE';

export const Scope = (input: ScopeInput) => SetMetadata(SCOPE_KEY, input);
