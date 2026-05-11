// Backend capability flags. Toggle to true once the corresponding query
// parameter is supported by `mx-core` /posts list endpoint.
export const BACKEND_CAPS = {
  postsTagIds: false,
  postsStatus: false,
  postsPin: false,
} as const

export type BackendCap = keyof typeof BACKEND_CAPS
