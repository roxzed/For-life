import { Play, Pause, X } from 'lucide-react'

interface RestTimerProps {
  timeLeft: number
  isRunning: boolean
  isComplete: boolean
  progress: number
  onPause: () => void
  onResume: () => void
  onReset: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function RestTimer({
  timeLeft,
  isRunning,
  isComplete,
  progress,
  onPause,
  onResume,
  onReset,
}: RestTimerProps) {
  if (timeLeft === 0 && !isComplete) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
      <div className={`glass-card px-6 py-3 flex items-center gap-4 ${
        isComplete ? 'glow-green border-neon-green/40' : 'glow-cyan border-neon-cyan/40'
      }`}>
        {/* Circular progress */}
        <div className="relative h-12 w-12">
          <svg className="h-12 w-12 -rotate-90" viewBox="0 0 48 48">
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="#2a2a4a"
              strokeWidth="3"
            />
            <circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke={isComplete ? '#39ff14' : '#00f0ff'}
              strokeWidth="3"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - progress)}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
              style={{
                filter: `drop-shadow(0 0 4px ${isComplete ? 'rgba(57,255,20,0.5)' : 'rgba(0,240,255,0.5)'})`,
              }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
            isComplete ? 'neon-text-green' : 'neon-text-cyan'
          }`}>
            {isComplete ? 'GO!' : formatTime(timeLeft)}
          </span>
        </div>

        {/* Label */}
        <span className="text-sm text-gray-300">
          {isComplete ? 'Descanso completo!' : 'Descansando...'}
        </span>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {!isComplete && (
            <button
              onClick={isRunning ? onPause : onResume}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-border text-gray-400 hover:text-neon-cyan transition-colors"
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
            </button>
          )}
          <button
            onClick={onReset}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-dark-border text-gray-400 hover:text-neon-magenta transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
