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
  | 'choice' | 'multiple' | 'typing' | 'translation'
  | 'gapfill' | 'drag' | 'draw' | 'picture_choice' | 'conversation'

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

export interface VocabWord {
  id: string; kanji: string; kana: string; meaning: string; knowledge: number
}

export interface VocabResponse {
  words: VocabWord[]; total: number; page: number; totalPages: number
}

export interface TaskGroup {
  id: string; name: string; description: string; taskCount: number
}

export type IncorrectAction = 'show_answer' | 'show_hint' | 'nothing'

export interface UserSettings {
  level: string
  aiStyle: string
  notifications: boolean
  incorrectAction: IncorrectAction
  maxRetries: number
  aiCanOverride: boolean
  drawMatchThreshold: number
  shuffleTasks: boolean
}

export interface SavedSession {
  sessionId: string
  tasks: Task[]
  currentIdx: number
  history: number[]
  retries: Record<string, number>
  handledLocked: Task[]
  shuffleTasks: boolean
}

export interface DashboardSummary {
  todayMinutes: number
  todayTasks: number
  todayAccuracy: number
  streakDays: number
  hasActiveSession: boolean
  hiragana: number
  katakana: number
}
