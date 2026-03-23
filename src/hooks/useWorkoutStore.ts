import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DayOfWeek, DayLog, ExerciseLog, SetLog } from '../types/workout'
import { WORKOUT_PLAN } from '../data/workout-plan'
import { format, subDays } from 'date-fns'

interface WeightHistory {
  exerciseId: string
  date: string
  weight: number
  reps: number
}

interface WorkoutState {
  dayLogs: Record<string, DayLog>
  weightHistory: WeightHistory[]
  initDay: (date: string, dayOfWeek: DayOfWeek) => void
  toggleSet: (date: string, exerciseId: string, setNumber: number) => void
  logWeight: (date: string, exerciseId: string, setNumber: number, weight: number) => void
  logReps: (date: string, exerciseId: string, setNumber: number, reps: number) => void
  getLastWeight: (exerciseId: string) => number | undefined
  getCarriedOverExercises: (date: string) => ExerciseLog[]
  getDayLog: (date: string) => DayLog | undefined
}

function createExerciseLog(exercise: { id: string; name: string; defaultSets: number; defaultReps: string }, carriedOver = false, originalDay?: DayOfWeek): ExerciseLog {
  const sets: SetLog[] = Array.from({ length: exercise.defaultSets }, (_, i) => ({
    setNumber: i + 1,
    targetReps: exercise.defaultReps,
    completed: false,
  }))

  return {
    exerciseId: exercise.id,
    exerciseName: exercise.name,
    sets,
    completed: false,
    carriedOver,
    originalDay,
  }
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      dayLogs: {},
      weightHistory: [],

      initDay: (date: string, dayOfWeek: DayOfWeek) => {
        const state = get()
        if (state.dayLogs[date]) return

        const plan = WORKOUT_PLAN[dayOfWeek]
        const allExercises = [...plan.mainExercises, ...plan.absExercises]

        const exercises = allExercises.map(ex => createExerciseLog(ex))

        // Check for carried over exercises from yesterday
        const yesterday = format(subDays(new Date(date), 1), 'yyyy-MM-dd')
        const yesterdayLog = state.dayLogs[yesterday]
        const carriedOver: ExerciseLog[] = []

        if (yesterdayLog) {
          for (const ex of yesterdayLog.exercises) {
            if (!ex.completed && !ex.carriedOver) {
              carriedOver.push(createExerciseLog(
                { id: ex.exerciseId, name: ex.exerciseName, defaultSets: ex.sets.length, defaultReps: ex.sets[0]?.targetReps || '10-12' },
                true,
                yesterdayLog.dayOfWeek,
              ))
            }
          }
        }

        const allDayExercises = [...carriedOver, ...exercises]

        set({
          dayLogs: {
            ...state.dayLogs,
            [date]: {
              date,
              dayOfWeek,
              exercises: allDayExercises,
              completedCount: 0,
              totalCount: allDayExercises.length,
              startedAt: new Date().toISOString(),
            },
          },
        })
      },

      toggleSet: (date: string, exerciseId: string, setNumber: number) => {
        set((state) => {
          const dayLog = state.dayLogs[date]
          if (!dayLog) return state

          const exercises = dayLog.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex

            const sets = ex.sets.map(s => {
              if (s.setNumber !== setNumber) return s
              return { ...s, completed: !s.completed }
            })

            const completed = sets.every(s => s.completed)
            return { ...ex, sets, completed }
          })

          const completedCount = exercises.filter(ex => ex.completed).length

          return {
            dayLogs: {
              ...state.dayLogs,
              [date]: {
                ...dayLog,
                exercises,
                completedCount,
                completedAt: completedCount === dayLog.totalCount ? new Date().toISOString() : undefined,
              },
            },
          }
        })
      },

      logWeight: (date: string, exerciseId: string, setNumber: number, weight: number) => {
        set((state) => {
          const dayLog = state.dayLogs[date]
          if (!dayLog) return state

          const exercises = dayLog.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            const sets = ex.sets.map(s => {
              if (s.setNumber !== setNumber) return s
              return { ...s, weight }
            })
            return { ...ex, sets }
          })

          const newHistory = [...state.weightHistory]
          const existing = newHistory.findIndex(
            h => h.exerciseId === exerciseId && h.date === date
          )
          if (existing >= 0) {
            newHistory[existing] = { exerciseId, date, weight, reps: newHistory[existing].reps }
          } else {
            newHistory.push({ exerciseId, date, weight, reps: 0 })
          }

          return {
            dayLogs: { ...state.dayLogs, [date]: { ...dayLog, exercises } },
            weightHistory: newHistory,
          }
        })
      },

      logReps: (date: string, exerciseId: string, setNumber: number, reps: number) => {
        set((state) => {
          const dayLog = state.dayLogs[date]
          if (!dayLog) return state

          const exercises = dayLog.exercises.map(ex => {
            if (ex.exerciseId !== exerciseId) return ex
            const sets = ex.sets.map(s => {
              if (s.setNumber !== setNumber) return s
              return { ...s, actualReps: reps }
            })
            return { ...ex, sets }
          })

          return {
            dayLogs: { ...state.dayLogs, [date]: { ...dayLog, exercises } },
          }
        })
      },

      getLastWeight: (exerciseId: string) => {
        const history = get().weightHistory.filter(h => h.exerciseId === exerciseId)
        if (history.length === 0) return undefined
        return history.sort((a, b) => b.date.localeCompare(a.date))[0].weight
      },

      getCarriedOverExercises: (date: string) => {
        const dayLog = get().dayLogs[date]
        if (!dayLog) return []
        return dayLog.exercises.filter(ex => ex.carriedOver)
      },

      getDayLog: (date: string) => {
        return get().dayLogs[date]
      },
    }),
    {
      name: 'forlife-workout',
    }
  )
)
