import { Trophy, Flame, Droplets, Dumbbell, Heart, Zap, Shield, Award } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { useGamificationStore } from '../hooks/useGamificationStore'
import { useCardioStore } from '../hooks/useCardioStore'
import { useWorkoutStore } from '../hooks/useWorkoutStore'
import { getLevelForXp, LEVELS, ACHIEVEMENTS } from '../types/gamification'

const ACHIEVEMENT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  trophy: Trophy,
  swords: Dumbbell,
  droplets: Droplets,
  'heart-pulse': Heart,
  flame: Flame,
  shield: Shield,
  'calendar-check': Award,
  'calendar-heart': Award,
}

export function DashboardPage() {
  const { xp, streaks, achievements, weeklyXp } = useGamificationStore()
  const { getTotalSessions } = useCardioStore()
  const { dayLogs } = useWorkoutStore()
  const level = getLevelForXp(xp)
  const nextLevel = LEVELS.find(l => l.level === level.level + 1)

  const totalWorkouts = Object.values(dayLogs).filter(d => d.completedCount > 0).length
  const totalCardio = getTotalSessions()

  return (
    <div className="min-h-dvh">
      <Header title="Painel" subtitle="Seu progresso" />

      <div className="space-y-4 p-4">
        {/* Level card */}
        <div className="glass-card p-5 text-center glow-cyan">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap size={24} className="text-neon-yellow" />
            <h2 className="text-2xl font-bold neon-text-cyan">{level.title}</h2>
          </div>
          <p className="text-xs text-gray-400 mb-3">Nivel {level.level}</p>

          <div className="text-3xl font-bold text-white mb-1">
            {xp.toLocaleString()} <span className="text-sm text-neon-yellow">XP</span>
          </div>

          {nextLevel && (
            <>
              <div className="h-2 w-full rounded-full bg-dark-card overflow-hidden mt-3">
                <div
                  className="h-full neon-progress-bar transition-all duration-500"
                  style={{ width: `${level.progress * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                {level.xpForNext.toLocaleString()} XP para {nextLevel.title}
              </p>
            </>
          )}
        </div>

        {/* Weekly XP */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-2">ESTA SEMANA</h3>
          <div className="text-xl font-bold neon-text-cyan">
            +{weeklyXp.toLocaleString()} XP
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-4 text-center">
            <Dumbbell size={20} className="text-neon-cyan mx-auto mb-1" />
            <div className="text-xl font-bold text-white">{totalWorkouts}</div>
            <p className="text-[10px] text-gray-500">Treinos</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Heart size={20} className="text-neon-magenta mx-auto mb-1" />
            <div className="text-xl font-bold text-white">{totalCardio}</div>
            <p className="text-[10px] text-gray-500">Cardios</p>
          </div>
        </div>

        {/* Streaks */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">SEQUENCIAS</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Flame size={16} className={`text-neon-orange ${streaks.workout > 0 ? 'flame-animation' : ''}`} />
                <span className="text-lg font-bold text-white">{streaks.workout}</span>
              </div>
              <p className="text-[10px] text-gray-500">Treino</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Droplets size={16} className={`text-neon-cyan ${streaks.water > 0 ? 'flame-animation' : ''}`} />
                <span className="text-lg font-bold text-white">{streaks.water}</span>
              </div>
              <p className="text-[10px] text-gray-500">Agua</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap size={16} className={`text-neon-yellow ${streaks.supplements > 0 ? 'flame-animation' : ''}`} />
                <span className="text-lg font-bold text-white">{streaks.supplements}</span>
              </div>
              <p className="text-[10px] text-gray-500">Suplem.</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">
            CONQUISTAS ({achievements.length}/{ACHIEVEMENTS.length})
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {ACHIEVEMENTS.map((ach) => {
              const Icon = ACHIEVEMENT_ICONS[ach.icon] || Trophy
              const unlocked = achievements.includes(ach.id)
              return (
                <div
                  key={ach.id}
                  className={`rounded-xl p-3 transition-all duration-200 ${
                    unlocked
                      ? 'bg-neon-yellow/5 border border-neon-yellow/20 achievement-unlock'
                      : 'bg-dark-card/50 border border-dark-border opacity-40'
                  }`}
                >
                  <Icon size={18} className={unlocked ? 'text-neon-yellow mb-1' : 'text-gray-600 mb-1'} />
                  <p className={`text-xs font-bold ${unlocked ? 'text-white' : 'text-gray-600'}`}>
                    {ach.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{ach.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Levels roadmap */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">NIVEIS</h3>
          <div className="space-y-2">
            {LEVELS.map((l) => {
              const isCurrent = l.level === level.level
              const isUnlocked = xp >= l.xpRequired
              return (
                <div
                  key={l.level}
                  className={`flex items-center gap-3 rounded-lg p-2 ${
                    isCurrent ? 'bg-neon-cyan/10 border border-neon-cyan/20' : ''
                  }`}
                >
                  <span className={`text-xs font-bold w-4 ${
                    isUnlocked ? 'text-neon-cyan' : 'text-gray-600'
                  }`}>
                    {l.level}
                  </span>
                  <span className={`text-sm font-medium flex-1 ${
                    isCurrent ? 'neon-text-cyan' : isUnlocked ? 'text-white' : 'text-gray-600'
                  }`}>
                    {l.title}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {l.xpRequired.toLocaleString()} XP
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
