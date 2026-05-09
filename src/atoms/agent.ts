import { atomWithStorage } from 'jotai/utils'

export const selectedAgentModelAtom = atomWithStorage<string | null>(
  'mx-admin:agent-model',
  null,
)
