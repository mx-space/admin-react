import { atom } from 'jotai'

export type TrackedAiTaskKind =
  | 'summary'
  | 'insights'
  | 'translation'
  | 'slug'

export type TrackedAiTaskStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'

export interface TrackedAiTask {
  id: string
  kind: TrackedAiTaskKind
  status: TrackedAiTaskStatus
  progress: number
  startedAt: number
  finishedAt?: number
  error?: string
}

export const aiTasksAtom = atom<TrackedAiTask[]>([])
export const aiTaskQueueOpenAtom = atom<boolean>(false)

export const aiActiveCountAtom = atom((get) =>
  get(aiTasksAtom).filter(
    (t) => t.status === 'pending' || t.status === 'running',
  ).length,
)

export const aiOverallProgressAtom = atom((get) => {
  const tasks = get(aiTasksAtom)
  if (tasks.length === 0) return 0
  return tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length
})
