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

export interface Task {
  id: string
  type: 'choice' | 'multiple' | 'typing' | 'translation'
  prompt: string
  options?: string[]
  correctAnswer: string
  hint?: string
  explanation?: string
}

export interface DailyStats {
  date: string
  minutesStudied: number
  tasksCompleted: number
  accuracy: number
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
