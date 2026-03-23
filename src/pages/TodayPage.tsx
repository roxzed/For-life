import { useEffect } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Dumbbell, Info } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { ProgressBar } from '../components/workout/ProgressBar'
import { ExerciseCard } from '../components/workout/ExerciseCard'
import { RestTimer } from '../components/workout/RestTimer'
import { useWorkoutStore } from '../hooks/useWorkoutStore'
import { useRestTimer } from '../hooks/useRestTimer'
import { WORKOUT_PLAN, getTodayDayOfWeek, DAY_LABELS } from '../data/workout-plan'

export function TodayPage() {
  const today = new Date()
  const dateStr = format(today, 'yyyy-MM-dd')
  const dayOfWeek = getTodayDayOfWeek()
  const plan = WORKOUT_PLAN[dayOfWeek]
  const { initDay, getDayLog } = useWorkoutStore()
  const timer = useRestTimer()

  useEffect(() => {
    initDay(dateStr, dayOfWeek)
  }, [dateStr, dayOfWeek, initDay])

  const dayLog = getDayLog(dateStr)

  const dayLabel = DAY_LABELS[dayOfWeek]
  const dateLabel = format(today, "dd 'de' MMMM", { locale: ptBR })

  const carriedOver = dayLog?.exercises.filter(e => e.carriedOver) || []
  const mainExercises = dayLog?.exercises.filter(e => !e.carriedOver && !plan.absExercises.some(a => a.id === e.exerciseId)) || []
  const absExercises = dayLog?.exercises.filter(e => !e.carriedOver && plan.absExercises.some(a => a.id === e.exerciseId)) || []

  const handleSetComplete = (restSeconds: number) => {
    timer.startTimer(restSeconds)
  }

  // Find rest seconds for each exercise
  const getRestSeconds = (exerciseId: string): number => {
    for (const day of Object.values(WORKOUT_PLAN)) {
      const found = [...day.mainExercises, ...day.absExercises].find(e => e.id === exerciseId)
      if (found) return found.defaultRestSeconds
    }
    return 60
  }

  return (
    <div className="min-h-dvh">
      <Header
        title={`${dayLabel} - ${plan.label}`}
        subtitle={dateLabel}
      />

      <div className="space-y-4 p-4">
        {/* Widget do dia */}
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neon-cyan/10 glow-cyan">
            <Dumbbell size={24} className="text-neon-cyan" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{plan.label}</h2>
            <p className="text-xs text-gray-400">
              {plan.mainExercises.length + plan.absExercises.length} exercicios
            </p>
          </div>
        </div>

        {/* Progress */}
        {dayLog && (
          <ProgressBar completed={dayLog.completedCount} total={dayLog.totalCount} />
        )}

        {/* Objective & Intensity */}
        <div className="glass-card p-3 flex items-start gap-2">
          <Info size={14} className="text-neon-cyan shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-gray-300">{plan.objective}</p>
            <p className="text-xs text-gray-500 mt-1">Intensidade: {plan.intensity}</p>
          </div>
        </div>

        {/* Carried over exercises */}
        {carriedOver.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-neon-yellow mb-2 px-1 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-neon-yellow animate-pulse" />
              ARRASTADO DE ONTEM ({carriedOver.length})
            </h3>
            <div className="space-y-2">
              {carriedOver.map((ex) => (
                <ExerciseCard
                  key={`carried-${ex.exerciseId}`}
                  exercise={ex}
                  date={dateStr}
                  restSeconds={getRestSeconds(ex.exerciseId)}
                  onSetComplete={handleSetComplete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main exercises */}
        <div>
          <h3 className="text-xs font-bold text-neon-cyan mb-2 px-1">
            TREINO PRINCIPAL ({mainExercises.length})
          </h3>
          <div className="space-y-2">
            {mainExercises.map((ex) => (
              <ExerciseCard
                key={ex.exerciseId}
                exercise={ex}
                date={dateStr}
                restSeconds={getRestSeconds(ex.exerciseId)}
                onSetComplete={handleSetComplete}
              />
            ))}
          </div>
        </div>

        {/* Abs */}
        <div>
          <h3 className="text-xs font-bold text-neon-magenta mb-2 px-1">
            ABDOMEN ({absExercises.length})
          </h3>
          <div className="space-y-2">
            {absExercises.map((ex) => (
              <ExerciseCard
                key={ex.exerciseId}
                exercise={ex}
                date={dateStr}
                restSeconds={getRestSeconds(ex.exerciseId)}
                onSetComplete={handleSetComplete}
              />
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="glass-card p-3">
          <h3 className="text-xs font-bold text-gray-400 mb-2">DICAS DE EXECUCAO</h3>
          <ul className="space-y-1">
            {plan.tips.map((tip, i) => (
              <li key={i} className="text-xs text-gray-500 flex gap-2">
                <span className="text-neon-cyan">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rest Timer */}
      <RestTimer
        timeLeft={timer.timeLeft}
        isRunning={timer.isRunning}
        isComplete={timer.isComplete}
        progress={timer.progress}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
      />
    </div>
  )
}
