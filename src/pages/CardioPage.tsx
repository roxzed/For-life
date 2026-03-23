import { useState } from 'react'
import { format } from 'date-fns'
import { Waves, Bike, Trophy, Plus, Trash2 } from 'lucide-react'
import { Header } from '../components/layout/Header'
import { useCardioStore } from '../hooks/useCardioStore'
import { useGamificationStore } from '../hooks/useGamificationStore'
import type { CardioType } from '../types/cardio'
import { CARDIO_LABELS } from '../types/cardio'
import { XP_VALUES } from '../types/gamification'

const CARDIO_ICON_MAP = {
  natacao: Waves,
  spinning: Bike,
  'beach-tenis': Trophy,
}

export function CardioPage() {
  const today = format(new Date(), 'yyyy-MM-dd')
  const { sessions, addSession, removeSession } = useCardioStore()
  const { addXp } = useGamificationStore()

  const [type, setType] = useState<CardioType>('natacao')
  const [duration, setDuration] = useState('')
  const [distance, setDistance] = useState('')
  const [calories, setCalories] = useState('')
  const [avgHr, setAvgHr] = useState('')
  const [maxHr, setMaxHr] = useState('')
  const [notes, setNotes] = useState('')

  const todaySessions = sessions.filter(s => s.date === today)
  const recentSessions = sessions
    .filter(s => s.date !== today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!duration) return

    addSession({
      date: today,
      type,
      durationMinutes: Number(duration),
      distanceKm: distance ? Number(distance) : undefined,
      calories: calories ? Number(calories) : undefined,
      avgHeartRate: avgHr ? Number(avgHr) : undefined,
      maxHeartRate: maxHr ? Number(maxHr) : undefined,
      notes: notes || undefined,
      source: 'manual',
    })

    addXp(XP_VALUES.CARDIO_DONE)

    setDuration('')
    setDistance('')
    setCalories('')
    setAvgHr('')
    setMaxHr('')
    setNotes('')
  }

  return (
    <div className="min-h-dvh">
      <Header title="Cardio" subtitle="Registre seu aerobico" />

      <div className="space-y-4 p-4">
        {/* Type selector */}
        <div className="flex gap-2">
          {(Object.keys(CARDIO_LABELS) as CardioType[]).map((t) => {
            const Icon = CARDIO_ICON_MAP[t]
            const isSelected = type === t
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex-1 flex flex-col items-center gap-1 rounded-xl p-3 transition-all duration-200 ${
                  isSelected
                    ? 'glass-card glow-cyan border-neon-cyan/40'
                    : 'bg-dark-card border border-dark-border'
                }`}
              >
                <Icon size={20} className={isSelected ? 'text-neon-cyan' : 'text-gray-500'} />
                <span className={`text-[10px] font-medium ${isSelected ? 'text-neon-cyan' : 'text-gray-500'}`}>
                  {CARDIO_LABELS[t]}
                </span>
              </button>
            )
          })}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Duracao (min) *</label>
              <input
                type="number"
                inputMode="numeric"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full rounded-lg bg-dark-surface border border-dark-border px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Distancia (km)</label>
              <input
                type="number"
                inputMode="decimal"
                step="0.1"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full rounded-lg bg-dark-surface border border-dark-border px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">Calorias</label>
              <input
                type="number"
                inputMode="numeric"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full rounded-lg bg-dark-surface border border-dark-border px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 mb-1 block">FC Media</label>
              <input
                type="number"
                inputMode="numeric"
                value={avgHr}
                onChange={(e) => setAvgHr(e.target.value)}
                className="w-full rounded-lg bg-dark-surface border border-dark-border px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-gray-500 mb-1 block">Notas</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-lg bg-dark-surface border border-dark-border px-3 py-2 text-sm text-white focus:border-neon-cyan focus:outline-none"
              placeholder="Observacoes..."
            />
          </div>

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-neon-cyan/10 border border-neon-cyan/30 px-4 py-3 text-sm font-bold text-neon-cyan glow-cyan transition-all hover:bg-neon-cyan/20"
          >
            <Plus size={16} />
            Registrar Cardio
          </button>
        </form>

        {/* Today's sessions */}
        {todaySessions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-neon-green mb-2 px-1">HOJE</h3>
            <div className="space-y-2">
              {todaySessions.map((session) => {
                const Icon = CARDIO_ICON_MAP[session.type]
                return (
                  <div key={session.id} className="glass-card p-3 flex items-center gap-3">
                    <Icon size={18} className="text-neon-cyan" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{CARDIO_LABELS[session.type]}</p>
                      <p className="text-xs text-gray-500">
                        {session.durationMinutes}min
                        {session.distanceKm && ` • ${session.distanceKm}km`}
                        {session.calories && ` • ${session.calories}cal`}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSession(session.id)}
                      className="text-gray-600 hover:text-neon-magenta transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent history */}
        {recentSessions.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2 px-1">HISTORICO</h3>
            <div className="space-y-2">
              {recentSessions.map((session) => {
                const Icon = CARDIO_ICON_MAP[session.type]
                return (
                  <div key={session.id} className="glass-card p-3 flex items-center gap-3">
                    <Icon size={16} className="text-gray-500" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-300">{CARDIO_LABELS[session.type]}</p>
                      <p className="text-[10px] text-gray-600">
                        {session.date} • {session.durationMinutes}min
                        {session.calories && ` • ${session.calories}cal`}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
