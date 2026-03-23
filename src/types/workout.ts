export type DayOfWeek = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado'

export type MuscleGroup =
  | 'peito' | 'costas' | 'ombros' | 'triceps'
  | 'biceps' | 'trapezio' | 'abdomen' | 'pernas'

export interface ExerciseDefinition {
  id: string
  name: string
  muscleGroup: MuscleGroup
  equipment: string
  defaultSets: number
  defaultReps: string
  defaultRestSeconds: number
  isAbExercise: boolean
  isTimeBased?: boolean
  defaultDuration?: string
  tips?: string
}

export interface DayPlan {
  dayOfWeek: DayOfWeek
  label: string
  objective: string
  intensity: string
  mainExercises: ExerciseDefinition[]
  absExercises: ExerciseDefinition[]
  tips: string[]
}

export interface SetLog {
  setNumber: number
  targetReps: string
  actualReps?: number
  weight?: number
  completed: boolean
  duration?: number
}

export interface ExerciseLog {
  exerciseId: string
  exerciseName: string
  sets: SetLog[]
  completed: boolean
  carriedOver: boolean
  originalDay?: DayOfWeek
  notes?: string
}

export interface DayLog {
  date: string
  dayOfWeek: DayOfWeek
  exercises: ExerciseLog[]
  completedCount: number
  totalCount: number
  startedAt?: string
  completedAt?: string
}
