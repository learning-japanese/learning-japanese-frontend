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
  userAnswer?: string
  isCorrect?: boolean
  explanation?: string
}

export interface DailyStats {
  date: string
  minutesStudied: number
  tasksCompleted: number
  accuracy: number
}

export interface ProgressData {
  labels: string[]
  accuracy: number[]
  tasksPerDay: number[]
}
