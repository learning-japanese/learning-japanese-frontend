import { http, HttpResponse } from 'msw'

const chatReplies = [
  'Привет! 💖 Как настроение? Готова помочь с японским.',
  'Отлично! すごいね！Ты молодец, что занимаешься.',
  'Поняла! Давай разберём это. Спрашивай что хочешь, всё объясню.',
  'えっと… давай подумаем вместе. Я уверена, ты справишься!',
  'Ой, я тоже так путалась сначала! 大丈夫, всё получится.',
  'Хочешь, я расскажу тебе что-нибудь интересное про японский?',
  'ねえ… а ты знаешь, что かわいい — это не только «милый», но и «хороший» в разговорном?',
  'Ты молодец что практикуешься! 頑張ってね〜',
  'Спрашивай что угодно, я отвечу с радостью! もちろん！',
  'Давай повторим то, что учили. Что ты помнишь из прошлого раза?',
  '今日はどんな気分？Какое настроение сегодня?',
  'Если что-то непонятно — пиши, я объясню по-русски.',
]

export const handlers = [
  http.get('/api/v1/profile', () =>
    HttpResponse.json({
      id: '1',
      name: 'Изучающий',
      level: 'beginner',
      kanaProgress: { hiragana: 65, katakana: 30 },
      streakDays: 3,
      totalStudyMinutes: 145,
    }),
  ),

  http.post('/api/v1/session/start', () =>
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
          hint: 'Первая гласная в японском алфавите',
          explanation:
            'あ — хирагана для звука "a". Происходит от упрощённого написания 安.',
          skipped: 0,
        },
        {
          id: 'task-2',
          type: 'gapfill',
          prompt: 'Вставь пропущенное слово: "私は ___ です (я — студент)"',
          options: ['学生', '先生', '会社員', '医者'],
          correctAnswer: '学生',
          hint: 'がくせい — студент',
          explanation:
            '学生 (がくせい) — студент. 私は学生です — я студент.',
          skipped: 0,
        },
        {
          id: 'task-3',
          type: 'picture_choice',
          prompt: 'Что изображено на картинке? 🏀',
          options: ['Баскетбол', 'Футбол', 'Теннис', 'Бейсбол'],
          correctAnswer: 'Баскетбол',
          hint: 'Оранжевый мяч, кольцо',
          explanation: '🏀 — баскетбол. По-японски: バスケットボール.',
          skipped: 0,
        },
        {
          id: 'task-4',
          type: 'drag',
          prompt: 'Расставь слова в правильном порядке: "я / студент / есть"',
          slots: ['___', '___', '___'],
          options: ['私は', '学生', 'です'],
          correctAnswer: '私は,学生,です',
          hint: 'В японском порядок: SOV (подлежащее-объект-глагол)',
          explanation:
            '私は学生です — я студент. 私 (watashi) — я, 学生 (gakusei) — студент, です — есть/являться.',
          skipped: 0,
        },
        {
          id: 'task-5',
          type: 'draw',
          prompt: 'Нарисуй хирагану "あ"',
          correctAnswer: 'あ',
          hint: 'Три черты: горизонтальная, вертикальная, петля',
          explanation:
            'あ пишется тремя чертами. Сначала горизонтальная, затем вертикальная с петлёй.',
          skipped: 0,
        },
      ],
    }),
  ),

  http.post('/api/v1/session/:id/submit', () =>
    HttpResponse.json({
      results: [
        { taskId: 'task-1', correct: true, explanation: 'Верно! あ = a' },
        {
          taskId: 'task-2',
          correct: false,
          explanation: 'Попробуй ещё раз.',
        },
      ],
      sessionSummary: { correct: 1, total: 2, accuracy: 50 },
    }),
  ),

  http.post('/api/v1/chat', async ({ request }) => {
    const body = (await request.json()) as { messages: { text: string }[] }
    const last = body.messages?.at(-1)?.text ?? ''
    const reply =
      last.toLowerCase().includes('kawaii') ||
      last.toLowerCase().includes('кавай') ||
      last.toLowerCase().includes('мил')
        ? 'かわいい〜! Ты тоже очень милый, когда стараешься! 💖'
        : chatReplies[Math.floor(Math.random() * chatReplies.length)]
    return HttpResponse.json({ reply })
  }),

  http.get('/api/v1/stats', () =>
    HttpResponse.json({
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      accuracy: [60, 75, 80, 65, 90, 85, 70],
      minutes: [15, 25, 30, 10, 45, 35, 20],
      tasksPerDay: [5, 8, 10, 6, 12, 9, 7],
    }),
  ),
]
