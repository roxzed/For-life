import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CardioSession } from '../types/cardio'

interface CardioState {
  sessions: CardioSession[]
  addSession: (session: Omit<CardioSession, 'id'>) => void
  removeSession: (id: string) => void
  getSessionsByDate: (date: string) => CardioSession[]
  getTotalSessions: () => number
}

export const useCardioStore = create<CardioState>()(
  persist(
    (set, get) => ({
      sessions: [],

      addSession: (session) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        set((state) => ({
          sessions: [...state.sessions, { ...session, id }],
        }))
      },

      removeSession: (id: string) => {
        set((state) => ({
          sessions: state.sessions.filter(s => s.id !== id),
        }))
      },

      getSessionsByDate: (date: string) => {
        return get().sessions.filter(s => s.date === date)
      },

      getTotalSessions: () => {
        return get().sessions.length
      },
    }),
    {
      name: 'forlife-cardio',
    }
  )
)
