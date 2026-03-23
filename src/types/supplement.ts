export type SupplementId = 'creatina' | 'omega3' | 'curcumina' | 'vitaminaC'

export interface SupplementDefinition {
  id: SupplementId
  name: string
  icon: string
  reminderTime: string
}

export interface SupplementLog {
  date: string
  supplements: Record<SupplementId, boolean>
}

export interface WaterLog {
  date: string
  glasses: number // each glass = 500ml
  goalGlasses: number // 10 = 5L
}

export const SUPPLEMENTS: SupplementDefinition[] = [
  { id: 'creatina', name: 'Creatina', icon: 'zap', reminderTime: '12:00' },
  { id: 'omega3', name: 'Omega 3', icon: 'fish', reminderTime: '12:00' },
  { id: 'curcumina', name: 'Curcumina', icon: 'flower2', reminderTime: '12:00' },
  { id: 'vitaminaC', name: 'Vitamina C', icon: 'citrus', reminderTime: '12:00' },
]

export const WATER_GOAL_GLASSES = 10 // 10 x 500ml = 5L
export const WATER_ML_PER_GLASS = 500
export const WATER_ALERT_START_HOUR = 8
export const WATER_ALERT_INTERVAL_MINUTES = 30
