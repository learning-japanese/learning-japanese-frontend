export interface UserProfile {
  id: string
  name: string
  level: string
  kanaProgress: { hiragana: number; katakana: number }
  streakDays: number
  totalStudyMinutes: number
}

export interface Session {
  id: string
  startedAt: string
  tasks: Task[]
  mood?: string
}

export type TaskType =
  | 'choice'
  | 'multiple'
  | 'typing'
  | 'translation'
  | 'gapfill'
  | 'drag'
  | 'draw'
  | 'picture_choice'

export interface Task {
  id: string
  type: TaskType
  prompt: string
  options?: string[]
  slots?: string[]
  correctAnswer: string
  hint?: string
  explanation?: string
  skipped: number
}

export interface DailyStats {
  labels: string[]
  accuracy: number[]
  minutes: number[]
  tasksPerDay: number[]
}

export type IncorrectAction = 'show_answer' | 'show_hint' | 'nothing'

export interface UserSettings {
  level: string
  aiStyle: string
  notifications: boolean
  incorrectAction: IncorrectAction
  maxRetries: number
  aiCanOverride: boolean
}
