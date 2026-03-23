import { Check } from 'lucide-react'
import type { SetLog } from '../../types/workout'

interface SetRowProps {
  set: SetLog
  lastWeight?: number
  onToggle: () => void
  onWeightChange: (weight: number) => void
  onRepsChange: (reps: number) => void
}

export function SetRow({ set, lastWeight, onToggle, onWeightChange, onRepsChange }: SetRowProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
        set.completed
          ? 'bg-neon-green/10 border border-neon-green/20'
          : 'bg-dark-card/50 border border-transparent'
      }`}
    >
      {/* Set number */}
      <span className="w-6 text-center text-xs font-bold text-gray-500">
        S{set.setNumber}
      </span>

      {/* Target reps */}
      <span className="text-xs text-gray-400 w-14">
        {set.targetReps}
      </span>

      {/* Weight input */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="decimal"
          placeholder={lastWeight ? String(lastWeight) : 'kg'}
          value={set.weight || ''}
          onChange={(e) => onWeightChange(Number(e.target.value))}
          className="w-16 rounded bg-dark-surface border border-dark-border px-2 py-1 text-center text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors"
        />
        <span className="text-[10px] text-gray-500">kg</span>
      </div>

      {/* Reps input */}
      <div className="flex items-center gap-1">
        <input
          type="number"
          inputMode="numeric"
          placeholder="reps"
          value={set.actualReps || ''}
          onChange={(e) => onRepsChange(Number(e.target.value))}
          className="w-14 rounded bg-dark-surface border border-dark-border px-2 py-1 text-center text-sm text-white focus:border-neon-cyan focus:outline-none transition-colors"
        />
      </div>

      {/* Check button */}
      <button
        onClick={onToggle}
        className={`ml-auto flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
          set.completed
            ? 'bg-neon-green text-dark-bg glow-green'
            : 'border-2 border-dark-border text-gray-500 hover:border-neon-cyan'
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </button>
    </div>
  )
}
