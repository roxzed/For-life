import { format } from 'date-fns'
import { Check, Droplets, Zap, Fish, Flower2, Citrus, Plus, Minus, PartyPopper } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { useSupplementStore } from '../hooks/useSupplementStore'
import { useGamificationStore } from '../hooks/useGamificationStore'
import type { SupplementId } from '../types/supplement'
import { SUPPLEMENTS, WATER_GOAL_GLASSES, WATER_ML_PER_GLASS } from '../types/supplement'
import { XP_VALUES } from '../types/gamification'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  zap: Zap,
  fish: Fish,
  flower2: Flower2,
  citrus: Citrus,
}

export function SupplementsPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const {
    getSupplementStatus,
    toggleSupplement,
    getWaterGlasses,
    addWaterGlass,
    removeWaterGlass,
    isWaterGoalMet,
    allSupplementsTaken,
  } = useSupplementStore()
  const { addXp } = useGamificationStore()

  const status = getSupplementStatus(today)
  const waterGlasses = getWaterGlasses(today)
  const waterGoalMet = isWaterGoalMet(today)
  const totalWaterMl = waterGlasses * WATER_ML_PER_GLASS
  const totalWaterL = (totalWaterMl / 1000).toFixed(1)
  const goalL = (WATER_GOAL_GLASSES * WATER_ML_PER_GLASS / 1000).toFixed(0)
  const waterPercentage = Math.min(100, (waterGlasses / WATER_GOAL_GLASSES) * 100)

  const handleToggleSupplement = (id: SupplementId) => {
    const wasAllTaken = allSupplementsTaken(today)
    toggleSupplement(today, id)
    // Check if all are now taken (after toggle)
    if (!wasAllTaken && !status[id]) {
      const newStatus = { ...status, [id]: true }
      if (Object.values(newStatus).every(Boolean)) {
        addXp(XP_VALUES.SUPPLEMENTS_DONE)
      }
    }
  }

  const handleAddWater = () => {
    const wasGoalMet = waterGoalMet
    addWaterGlass(today)
    if (!wasGoalMet && waterGlasses + 1 >= WATER_GOAL_GLASSES) {
      addXp(XP_VALUES.WATER_GOAL)
    }
  }

  return (
    <div className="min-h-dvh">
      <Header title="Suplementos" subtitle="Controle diario" />

      <div className="space-y-4 p-4">
        {/* Water tracker */}
        <div className={`glass-card p-4 ${waterGoalMet ? 'border-neon-green/40 glow-green' : ''}`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Droplets size={20} className={waterGoalMet ? 'text-neon-green' : 'text-neon-cyan'} />
              <h3 className="text-sm font-bold text-white">Agua</h3>
            </div>
            <span className={`text-sm font-bold ${waterGoalMet ? 'neon-text-green' : 'neon-text-cyan'}`}>
              {totalWaterL}L / {goalL}L
            </span>
          </div>

          {/* Water progress */}
          <div className="h-3 w-full rounded-full bg-dark-card overflow-hidden mb-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${waterPercentage}%`,
                background: waterGoalMet
                  ? 'linear-gradient(90deg, #39ff14, #00f0ff)'
                  : 'linear-gradient(90deg, #00f0ff, #0080ff)',
                boxShadow: waterGoalMet
                  ? '0 0 10px rgba(57, 255, 20, 0.5)'
                  : '0 0 10px rgba(0, 240, 255, 0.3)',
              }}
            />
          </div>

          {/* Glass counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {Array.from({ length: WATER_GOAL_GLASSES }, (_, i) => (
                <div
                  key={i}
                  className={`w-5 h-8 rounded-sm transition-all duration-200 ${
                    i < waterGlasses
                      ? 'bg-neon-cyan/40 border border-neon-cyan/60'
                      : 'bg-dark-card border border-dark-border'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">{waterGlasses}/{WATER_GOAL_GLASSES}</span>
          </div>

          {/* Add/remove buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => removeWaterGlass(today)}
              disabled={waterGlasses <= 0}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-dark-border px-3 py-2 text-xs text-gray-400 hover:text-neon-magenta hover:border-neon-magenta/30 transition-all disabled:opacity-30"
            >
              <Minus size={14} />
              500ml
            </button>
            <button
              onClick={handleAddWater}
              disabled={waterGoalMet}
              className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-2 text-xs font-bold text-neon-cyan glow-cyan transition-all hover:bg-neon-cyan/20 disabled:opacity-30"
            >
              <Plus size={14} />
              500ml
            </button>
          </div>

          {waterGoalMet && (
            <div className="flex items-center justify-center gap-2 mt-3 text-neon-green">
              <PartyPopper size={16} />
              <span className="text-xs font-bold">Meta batida! Parabens!</span>
              <PartyPopper size={16} />
            </div>
          )}
        </div>

        {/* Supplements checklist */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">
            SUPLEMENTOS - ALMOCO (12h)
          </h3>
          <div className="space-y-2">
            {SUPPLEMENTS.map((supp) => {
              const Icon = ICON_MAP[supp.icon] || Zap
              const taken = status[supp.id]
              return (
                <button
                  key={supp.id}
                  onClick={() => handleToggleSupplement(supp.id)}
                  className={`w-full flex items-center gap-3 rounded-xl p-3 transition-all duration-200 ${
                    taken
                      ? 'bg-neon-green/10 border border-neon-green/20'
                      : 'bg-dark-card border border-dark-border hover:border-neon-cyan/30'
                  }`}
                >
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    taken ? 'bg-neon-green/20' : 'bg-dark-surface'
                  }`}>
                    {taken ? (
                      <Check size={16} className="text-neon-green" />
                    ) : (
                      <Icon size={16} className="text-gray-500" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    taken ? 'text-neon-green line-through' : 'text-white'
                  }`}>
                    {supp.name}
                  </span>
                  {taken && (
                    <span className="ml-auto text-[10px] text-neon-green/60">Tomado</span>
                  )}
                </button>
              )
            })}
          </div>

          {allSupplementsTaken(today) && (
            <div className="flex items-center justify-center gap-2 mt-3 text-neon-green">
              <Check size={14} />
              <span className="text-xs font-bold">Todos os suplementos tomados!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
