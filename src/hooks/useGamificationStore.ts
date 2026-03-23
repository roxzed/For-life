import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GamificationState } from '../types/gamification'
import { XP_VALUES, getLevelForXp } from '../types/gamification'

interface GamificationStore extends GamificationState {
  addXp: (amount: number) => void
  incrementStreak: (type: 'workout' | 'water' | 'supplements') => void
  resetStreak: (type: 'workout' | 'water' | 'supplements') => void
  unlockAchievement: (id: string) => void
  hasAchievement: (id: string) => boolean
  getLevel: () => ReturnType<typeof getLevelForXp>
  resetWeeklyXp: () => void
}

export const useGamificationStore = create<GamificationStore>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streaks: { workout: 0, water: 0, supplements: 0 },
      achievements: [],
      weeklyXp: 0,

      addXp: (amount: number) => {
        set((state) => {
          const newXp = state.xp + amount
          const level = getLevelForXp(newXp)
          return {
            xp: newXp,
            level: level.level,
            weeklyXp: state.weeklyXp + amount,
          }
        })
      },

      incrementStreak: (type) => {
        set((state) => ({
          streaks: {
            ...state.streaks,
            [type]: state.streaks[type] + 1,
          },
        }))
      },

      resetStreak: (type) => {
        set((state) => ({
          streaks: {
            ...state.streaks,
            [type]: 0,
          },
        }))
      },

      unlockAchievement: (id: string) => {
        set((state) => {
          if (state.achievements.includes(id)) return state
          return { achievements: [...state.achievements, id] }
        })
      },

      hasAchievement: (id: string) => {
        return get().achievements.includes(id)
      },

      getLevel: () => {
        return getLevelForXp(get().xp)
      },

      resetWeeklyXp: () => {
        set({ weeklyXp: 0 })
      },
    }),
    {
      name: 'forlife-gamification',
    }
  )
)
