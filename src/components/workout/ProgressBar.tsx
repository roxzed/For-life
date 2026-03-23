interface ProgressBarProps {
  completed: number
  total: number
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

  return (
    <div className="glass-card p-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Progresso</span>
        <span className="text-sm font-bold">
          <span className="neon-text-cyan">{completed}</span>
          <span className="text-gray-500">/{total}</span>
          <span className="text-gray-400 ml-2">({percentage}%)</span>
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-dark-card overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${percentage}%`,
            background: percentage === 100
              ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
              : 'linear-gradient(90deg, #00f0ff, #f72585)',
            boxShadow: percentage === 100
              ? '0 0 10px rgba(57, 255, 20, 0.5)'
              : '0 0 10px rgba(0, 240, 255, 0.3)',
          }}
        />
      </div>
      {percentage === 100 && (
        <p className="text-center text-xs neon-text-green mt-2 font-bold">
          TREINO COMPLETO!
        </p>
      )}
    </div>
  )
}
