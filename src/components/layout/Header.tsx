import { Flame, Zap, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGamificationStore } from '../../hooks/useGamificationStore'
import { getLevelForXp } from '../../types/gamification'

interface HeaderProps {
  title: string
  subtitle?: string
}

export function Header({ title, subtitle }: HeaderProps) {
  const navigate = useNavigate()
  const { xp, streaks } = useGamificationStore()
  const level = getLevelForXp(xp)

  return (
    <header className="sticky top-0 z-40 border-b border-dark-border bg-dark-bg/95 backdrop-blur-sm px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold neon-text-cyan">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {streaks.workout > 0 && (
            <div className="flex items-center gap-1 text-neon-orange">
              <Flame size={16} className="flame-animation" />
              <span className="text-xs font-bold">{streaks.workout}</span>
            </div>
          )}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-dark-card border border-dark-border">
            <Zap size={14} className="text-neon-yellow" />
            <span className="text-xs font-bold text-neon-yellow">{level.title}</span>
          </div>
          <button
            onClick={() => navigate('/configuracoes')}
            className="text-gray-500 hover:text-neon-cyan transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </div>
      {/* XP progress bar */}
      <div className="mt-2 h-1 w-full rounded-full bg-dark-card overflow-hidden">
        <div
          className="h-full neon-progress-bar transition-all duration-500"
          style={{ width: `${level.progress * 100}%` }}
        />
      </div>
    </header>
  )
}
