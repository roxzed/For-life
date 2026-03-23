import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SupplementId } from '../types/supplement'
import { WATER_GOAL_GLASSES } from '../types/supplement'

interface SupplementState {
  logs: Record<string, Record<SupplementId, boolean>>
  waterLogs: Record<string, number>
  getSupplementStatus: (date: string) => Record<SupplementId, boolean>
  toggleSupplement: (date: string, id: SupplementId) => void
  getWaterGlasses: (date: string) => number
  addWaterGlass: (date: string) => void
  removeWaterGlass: (date: string) => void
  isWaterGoalMet: (date: string) => boolean
  allSupplementsTaken: (date: string) => boolean
}

const DEFAULT_SUPPLEMENTS: Record<SupplementId, boolean> = {
  creatina: false,
  omega3: false,
  curcumina: false,
  vitaminaC: false,
}

export const useSupplementStore = create<SupplementState>()(
  persist(
    (set, get) => ({
      logs: {},
      waterLogs: {},

      getSupplementStatus: (date: string) => {
        return get().logs[date] || { ...DEFAULT_SUPPLEMENTS }
      },

      toggleSupplement: (date: string, id: SupplementId) => {
        set((state) => {
          const current = state.logs[date] || { ...DEFAULT_SUPPLEMENTS }
          return {
            logs: {
              ...state.logs,
              [date]: { ...current, [id]: !current[id] },
            },
          }
        })
      },

      getWaterGlasses: (date: string) => {
        return get().waterLogs[date] || 0
      },

      addWaterGlass: (date: string) => {
        set((state) => {
          const current = state.waterLogs[date] || 0
          if (current >= WATER_GOAL_GLASSES) return state
          return {
            waterLogs: {
              ...state.waterLogs,
              [date]: current + 1,
            },
          }
        })
      },

      removeWaterGlass: (date: string) => {
        set((state) => {
          const current = state.waterLogs[date] || 0
          if (current <= 0) return state
          return {
            waterLogs: {
              ...state.waterLogs,
              [date]: current - 1,
            },
          }
        })
      },

      isWaterGoalMet: (date: string) => {
        return (get().waterLogs[date] || 0) >= WATER_GOAL_GLASSES
      },

      allSupplementsTaken: (date: string) => {
        const status = get().getSupplementStatus(date)
        return Object.values(status).every(Boolean)
      },
    }),
    {
      name: 'forlife-supplements',
    }
  )
)
