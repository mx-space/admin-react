// Auth/user/system query keys retained for non-data hooks (login, session bootstrap,
// init flow). Resource-data keys are owned by the createResourceTable engine under
// `['data', <resource>, ...]` and not redeclared here.

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => ['auth', 'session'] as const,
  },
  user: {
    all: ['user'] as const,
    owner: () => ['user', 'owner'] as const,
    allowLogin: () => ['user', 'allow-login'] as const,
  },
  system: {
    all: ['system'] as const,
    init: () => ['system', 'init'] as const,
  },
} as const

export type QueryKeyGroups = typeof queryKeys
