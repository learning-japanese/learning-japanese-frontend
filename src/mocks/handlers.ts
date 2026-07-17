import { http, HttpResponse } from 'msw'

const v1 = 'http://localhost:5173/api/v1'

export const handlers = [
  http.get(`${v1}/profile`, () =>
    HttpResponse.json({
      id: '1',
      name: 'Изучающий',
      level: 'beginner',
      kanaProgress: { hiragana: 65, katakana: 30 },
      streakDays: 3,
      totalStudyMinutes: 145,
    }),
  ),

  http.post(`${v1}/session/start`, () =>
    HttpResponse.json({
      id: 'session-1',
      startedAt: new Date().toISOString(),
      tasks: [
        {
          id: 'task-1',
          type: 'choice',
          prompt: 'Как читается あ?',
          options: ['a', 'i', 'u', 'e'],
          correctAnswer: 'a',
          explanation: 'あ — это хирагана для звука "a". Базовая гласная.',
        },
        {
          id: 'task-2',
          type: 'typing',
          prompt: 'Напиши хирагану для "ka"',
          correctAnswer: 'か',
          explanation: 'ka пишется как か (от 加 — упрощённая форма).',
        },
        {
          id: 'task-3',
          type: 'multiple',
          prompt: 'Какие из этих символов — хирагана?',
          options: ['あ', 'ア', 'い', 'イ'],
          correctAnswer: 'あ,い',
          explanation: 'あ и い — хирагана. ア и イ — катакана.',
        },
        {
          id: 'task-4',
          type: 'translation',
          prompt: 'Переведи на русский: "ありがとう"',
          correctAnswer: 'спасибо',
          explanation:
            'ありがとう (arigatou) — спасибо. Вежливая форма благодарности.',
        },
      ],
    }),
  ),

  http.post(`${v1}/session/:id/submit`, () =>
    HttpResponse.json({
      results: [
        { taskId: 'task-1', correct: true, explanation: 'Верно! あ = a' },
        {
          taskId: 'task-2',
          correct: false,
          explanation: 'ka = か. Ты написал(а) неверно.',
        },
      ],
      sessionSummary: { correct: 1, total: 2, accuracy: 50 },
    }),
  ),

  http.post(`${v1}/chat`, () =>
    HttpResponse.json({
      reply: 'えっと… すごいね！その調子で頑張ってね〜',
    }),
  ),

  http.get(`${v1}/stats`, () =>
    HttpResponse.json({
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      accuracy: [60, 75, 80, 65, 90, 85, 70],
      tasksPerDay: [5, 8, 10, 6, 12, 9, 7],
    }),
  ),
]
