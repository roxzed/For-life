export type CardioType = 'natacao' | 'spinning' | 'beach-tenis'

export interface CardioSession {
  id: string
  date: string
  type: CardioType
  durationMinutes: number
  distanceKm?: number
  calories?: number
  avgHeartRate?: number
  maxHeartRate?: number
  notes?: string
  source: 'manual' | 'garmin'
}

export const CARDIO_LABELS: Record<CardioType, string> = {
  natacao: 'Natacao',
  spinning: 'Spinning Indoor',
  'beach-tenis': 'Beach Tenis',
}

export const CARDIO_ICONS: Record<CardioType, string> = {
  natacao: 'waves',
  spinning: 'bike',
  'beach-tenis': 'trophy',
}
