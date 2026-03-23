export interface GamificationState {
  xp: number
  level: number
  streaks: {
    workout: number
    water: number
    supplements: number
  }
  achievements: string[]
  weeklyXp: number
}

export const XP_VALUES = {
  SET_COMPLETED: 10,
  EXERCISE_COMPLETED: 50,
  DAY_COMPLETED: 200,
  CARDIO_DONE: 150,
  SUPPLEMENTS_DONE: 50,
  WATER_GOAL: 100,
} as const

export const LEVELS = [
  { level: 1, title: 'Novato', xpRequired: 0 },
  { level: 2, title: 'Guerreiro', xpRequired: 1000 },
  { level: 3, title: 'Gladiador', xpRequired: 3000 },
  { level: 4, title: 'Tita', xpRequired: 7000 },
  { level: 5, title: 'Lenda', xpRequired: 15000 },
  { level: 6, title: 'Imortal', xpRequired: 30000 },
] as const

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  condition: string
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-pr', name: 'Primeiro PR', description: 'Bateu record de peso pela primeira vez', icon: 'trophy', condition: 'first_pr' },
  { id: 'monstro-peito', name: 'Monstro do Peito', description: '10 treinos de peito completos', icon: 'swords', condition: 'chest_10' },
  { id: 'hidratado', name: 'Hidratado', description: '7 dias seguidos com 5L', icon: 'droplets', condition: 'water_streak_7' },
  { id: 'maratonista', name: 'Maratonista', description: '20 sessoes de cardio', icon: 'heart-pulse', condition: 'cardio_20' },
  { id: 'sem-desculpa', name: 'Sem Desculpa', description: 'Completou exercicios arrastados', icon: 'flame', condition: 'carried_over_done' },
  { id: 'iron-man', name: 'Iron Man', description: '30 dias seguidos treinando', icon: 'shield', condition: 'workout_streak_30' },
  { id: 'streak-7', name: 'Uma Semana', description: '7 dias seguidos treinando', icon: 'calendar-check', condition: 'workout_streak_7' },
  { id: 'streak-30', name: 'Um Mes', description: '30 dias seguidos treinando', icon: 'calendar-heart', condition: 'workout_streak_30' },
]

export function getLevelForXp(xp: number) {
  let current = LEVELS[0]
  for (const level of LEVELS) {
    if (xp >= level.xpRequired) {
      current = level
    } else {
      break
    }
  }
  const nextLevel = LEVELS.find(l => l.level === current.level + 1)
  const xpForNext = nextLevel ? nextLevel.xpRequired - xp : 0
  const progress = nextLevel
    ? (xp - current.xpRequired) / (nextLevel.xpRequired - current.xpRequired)
    : 1
  return { ...current, xpForNext, progress }
}
