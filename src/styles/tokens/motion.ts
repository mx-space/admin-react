export const motion = {
  duration: {
    instant: 0.08,
    fast: 0.16,
    normal: 0.22,
    slow: 0.32,
    enter: 0.24,
    exit: 0.18,
  },
  easing: {
    standard: [0.2, 0, 0, 1] as const,
    decelerate: [0, 0, 0.2, 1] as const,
    accelerate: [0.4, 0, 1, 1] as const,
    overshoot: [0.34, 1.56, 0.64, 1] as const,
  },
} as const

export type MotionDuration = keyof typeof motion.duration
export type MotionEasing = keyof typeof motion.easing
