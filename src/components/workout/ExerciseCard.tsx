import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle2, AlertTriangle } from 'lucide-react'
import type { ExerciseLog } from '../../types/workout'
import { MUSCLE_GROUP_COLORS } from '../../data/workout-plan'
import { WORKOUT_PLAN } from '../../data/workout-plan'
import { SetRow } from './SetRow'
import { useWorkoutStore } from '../../hooks/useWorkoutStore'

interface ExerciseCardProps {
  exercise: ExerciseLog
  date: string
  restSeconds?: number
  onSetComplete?: (restSeconds: number) => void
}

export function ExerciseCard({ exercise, date, restSeconds = 60, onSetComplete }: ExerciseCardProps) {
  const [expanded, setExpanded] = useState(!exercise.completed)
  const { toggleSet, logWeight, logReps, getLastWeight } = useWorkoutStore()

  const completedSets = exercise.sets.filter(s => s.completed).length
  const totalSets = exercise.sets.length
  const lastWeight = getLastWeight(exercise.exerciseId)

  // Find exercise definition for muscle group color
  let muscleColor = '#00f0ff'
  for (const day of Object.values(WORKOUT_PLAN)) {
    const found = [...day.mainExercises, ...day.absExercises].find(e => e.id === exercise.exerciseId)
    if (found) {
      muscleColor = MUSCLE_GROUP_COLORS[found.muscleGroup] || '#00f0ff'
      break
    }
  }

  return (
    <div
      className={`glass-card overflow-hidden transition-all duration-300 ${
        exercise.completed ? 'border-neon-green/30' : ''
      } ${exercise.carriedOver ? 'border-neon-yellow/30' : ''}`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-3 text-left"
      >
        {/* Status icon */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
            exercise.completed ? 'bg-neon-green/20' : 'bg-dark-surface'
          }`}
          style={{ borderColor: muscleColor, borderWidth: '1px' }}
        >
          {exercise.completed ? (
            <CheckCircle2 size={20} className="text-neon-green" />
          ) : exercise.carriedOver ? (
            <AlertTriangle size={20} className="text-neon-yellow" />
          ) : (
            <span className="text-lg font-bold" style={{ color: muscleColor }}>
              {exercise.exerciseName.charAt(0)}
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-sm font-semibold truncate ${
            exercise.completed ? 'text-neon-green line-through opacity-70' : 'text-white'
          }`}>
            {exercise.exerciseName}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{
              backgroundColor: `${muscleColor}15`,
              color: muscleColor,
            }}>
              {completedSets}/{totalSets} series
            </span>
            {exercise.carriedOver && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-neon-yellow/10 text-neon-yellow">
                Arrastado
              </span>
            )}
            {lastWeight && (
              <span className="text-[10px] text-gray-500">
                Ultimo: {lastWeight}kg
              </span>
            )}
          </div>
        </div>

        {/* Expand/collapse */}
        {expanded ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {/* Sets */}
      {expanded && (
        <div className="space-y-1.5 px-3 pb-3">
          {exercise.sets.map((set) => (
            <SetRow
              key={set.setNumber}
              set={set}
              lastWeight={lastWeight}
              onToggle={() => {
                toggleSet(date, exercise.exerciseId, set.setNumber)
                if (!set.completed && onSetComplete) {
                  onSetComplete(restSeconds)
                }
              }}
              onWeightChange={(weight) => logWeight(date, exercise.exerciseId, set.setNumber, weight)}
              onRepsChange={(reps) => logReps(date, exercise.exerciseId, set.setNumber, reps)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
