// Hierarchical queryKey catalog. Mirrors source `src/hooks/queries/keys.ts`.
// Resource groups expand as views land (P3); P0 ships auth + system + AI prefix.

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    session: () => ['auth', 'session'] as const,
  },
  system: {
    all: ['system'] as const,
    appInfo: () => ['system', 'app-info'] as const,
    init: () => ['system', 'init'] as const,
  },
  posts: {
    all: ['posts'] as const,
    list: <P>(params: P) => ['posts', 'list', params] as const,
    detail: (id: string) => ['posts', 'detail', id] as const,
  },
  notes: {
    all: ['notes'] as const,
    list: <P>(params: P) => ['notes', 'list', params] as const,
    detail: (id: string) => ['notes', 'detail', id] as const,
  },
  comments: {
    all: ['comments'] as const,
    list: <P>(params: P) => ['comments', 'list', params] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
  ai: {
    all: ['ai'] as const,
    summaries: <P>(params: P) =>
      ['ai', 'summaries', 'grouped', params] as const,
    insights: <P>(params: P) => ['ai', 'insights', params] as const,
    translations: <P>(params: P) => ['ai', 'translations', params] as const,
    tasks: () => ['ai', 'tasks'] as const,
  },
} as const

export type QueryKeyGroups = typeof queryKeys
