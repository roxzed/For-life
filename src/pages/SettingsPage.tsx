import { useState } from 'react'
import { Download, Trash2, Info, ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { useWorkoutStore } from '../hooks/useWorkoutStore'
import { useCardioStore } from '../hooks/useCardioStore'
import { useSupplementStore } from '../hooks/useSupplementStore'
import { useGamificationStore } from '../hooks/useGamificationStore'

export function SettingsPage() {
  const navigate = useNavigate()
  const workoutStore = useWorkoutStore()
  const cardioStore = useCardioStore()
  const supplementStore = useSupplementStore()
  const gamificationStore = useGamificationStore()
  const [showConfirm, setShowConfirm] = useState(false)

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      workouts: workoutStore.dayLogs,
      weightHistory: workoutStore.weightHistory,
      cardio: cardioStore.sessions,
      supplements: supplementStore.logs,
      water: supplementStore.waterLogs,
      gamification: {
        xp: gamificationStore.xp,
        level: gamificationStore.level,
        streaks: gamificationStore.streaks,
        achievements: gamificationStore.achievements,
        weeklyXp: gamificationStore.weeklyXp,
      },
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forlife-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleExportCSV = () => {
    const rows: string[] = ['Data,Exercicio,Series Completas,Total Series,Peso (kg),Reps']

    for (const [date, log] of Object.entries(workoutStore.dayLogs)) {
      for (const ex of log.exercises) {
        const completedSets = ex.sets.filter(s => s.completed).length
        const lastWeight = ex.sets.find(s => s.weight)?.weight || ''
        const lastReps = ex.sets.find(s => s.actualReps)?.actualReps || ''
        rows.push(`${date},${ex.exerciseName},${completedSets},${ex.sets.length},${lastWeight},${lastReps}`)
      }
    }

    const blob = new Blob([rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `forlife-treinos-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    localStorage.removeItem('forlife-workout')
    localStorage.removeItem('forlife-cardio')
    localStorage.removeItem('forlife-supplements')
    localStorage.removeItem('forlife-gamification')
    window.location.reload()
  }

  return (
    <div className="min-h-dvh">
      <Header title="Configuracoes" subtitle="Dados e preferencias" />

      <div className="space-y-4 p-4">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm text-gray-400 hover:text-neon-cyan transition-colors"
        >
          <ChevronLeft size={16} />
          Voltar
        </button>

        {/* Export */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">EXPORTAR DADOS</h3>
          <div className="space-y-2">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-3 rounded-xl p-3 bg-dark-card border border-dark-border hover:border-neon-cyan/30 transition-all"
            >
              <Download size={18} className="text-neon-cyan" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Backup completo (JSON)</p>
                <p className="text-[10px] text-gray-500">Todos os dados em formato JSON</p>
              </div>
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 rounded-xl p-3 bg-dark-card border border-dark-border hover:border-neon-cyan/30 transition-all"
            >
              <Download size={18} className="text-neon-green" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Treinos (CSV)</p>
                <p className="text-[10px] text-gray-500">Historico de treinos para planilha</p>
              </div>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">ESTATISTICAS</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Dias registrados</span>
              <span className="text-white font-medium">{Object.keys(workoutStore.dayLogs).length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sessoes de cardio</span>
              <span className="text-white font-medium">{cardioStore.sessions.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Historico de pesos</span>
              <span className="text-white font-medium">{workoutStore.weightHistory.length} registros</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">XP total</span>
              <span className="text-neon-yellow font-medium">{gamificationStore.xp.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* About */}
        <div className="glass-card p-4">
          <h3 className="text-xs font-bold text-gray-400 mb-3">SOBRE</h3>
          <div className="flex items-start gap-2">
            <Info size={14} className="text-neon-cyan shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-white">For Life v1.0.0</p>
              <p className="text-xs text-gray-500 mt-1">
                App pessoal de acompanhamento de treino, cardio, suplementacao e hidratacao.
                Dados armazenados localmente no seu dispositivo.
              </p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="glass-card p-4 border-neon-magenta/20">
          <h3 className="text-xs font-bold text-neon-magenta mb-3">ZONA DE PERIGO</h3>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full flex items-center gap-3 rounded-xl p-3 bg-dark-card border border-neon-magenta/20 hover:border-neon-magenta/40 transition-all"
            >
              <Trash2 size={18} className="text-neon-magenta" />
              <div className="text-left">
                <p className="text-sm font-medium text-white">Limpar todos os dados</p>
                <p className="text-[10px] text-gray-500">Irreversivel! Exporte antes de apagar.</p>
              </div>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-neon-magenta font-bold">Tem certeza? Todos os dados serao perdidos!</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-lg border border-dark-border px-3 py-2 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 rounded-lg bg-neon-magenta/20 border border-neon-magenta/40 px-3 py-2 text-xs font-bold text-neon-magenta hover:bg-neon-magenta/30 transition-all"
                >
                  Apagar tudo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
