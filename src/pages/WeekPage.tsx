import { format, startOfWeek, addDays } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle2, Circle } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { useWorkoutStore } from '../hooks/useWorkoutStore'
import { WORKOUT_PLAN, DAY_ORDER, DAY_LABELS } from '../data/workout-plan'
import type { DayOfWeek } from '../types/workout'

export function WeekPage() {
  const { getDayLog } = useWorkoutStore()
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 0 })

  const days = DAY_ORDER.map((dayOfWeek, index) => {
    const date = addDays(weekStart, index)
    const dateStr = format(date, 'yyyy-MM-dd')
    const log = getDayLog(dateStr)
    const plan = WORKOUT_PLAN[dayOfWeek]
    const isToday = format(today, 'yyyy-MM-dd') === dateStr
    const isPast = date < today && !isToday

    return {
      dayOfWeek,
      date,
      dateStr,
      log,
      plan,
      isToday,
      isPast,
    }
  })

  return (
    <div className="min-h-dvh">
      <Header
        title="Visao Semanal"
        subtitle={`Semana de ${format(weekStart, "dd/MM", { locale: ptBR })}`}
      />

      <div className="space-y-3 p-4">
        {days.map(({ dayOfWeek, dateStr, log, plan, isToday, isPast }) => {
          const completed = log?.completedCount || 0
          const total = log?.totalCount || plan.mainExercises.length + plan.absExercises.length
          const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
          const isDone = percentage === 100

          return (
            <div
              key={dayOfWeek}
              className={`glass-card p-4 transition-all duration-200 ${
                isToday ? 'border-neon-cyan/40 glow-cyan' : ''
              } ${isDone ? 'border-neon-green/30' : ''}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {isDone ? (
                    <CheckCircle2 size={18} className="text-neon-green" />
                  ) : (
                    <Circle size={18} className={isPast ? 'text-gray-600' : 'text-gray-500'} />
                  )}
                  <div>
                    <h3 className={`text-sm font-bold ${
                      isToday ? 'neon-text-cyan' : isDone ? 'text-neon-green' : 'text-white'
                    }`}>
                      {DAY_LABELS[dayOfWeek]}
                      {isToday && <span className="text-[10px] ml-2 text-neon-cyan">(HOJE)</span>}
                    </h3>
                    <p className="text-xs text-gray-500">{plan.label}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  isDone ? 'neon-text-green' : percentage > 0 ? 'text-neon-cyan' : 'text-gray-600'
                }`}>
                  {percentage}%
                </span>
              </div>

              <div className="h-1.5 w-full rounded-full bg-dark-card overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    background: isDone
                      ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
                      : 'linear-gradient(90deg, #00f0ff, #f72585)',
                  }}
                />
              </div>

              {log && completed > 0 && (
                <p className="text-[10px] text-gray-500 mt-2">
                  {completed} de {total} exercicios completos
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
