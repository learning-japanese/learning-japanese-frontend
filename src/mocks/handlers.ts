import { http, HttpResponse } from 'msw'

const v1 = 'http://localhost:5173/api/v1'

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
          hint: 'Первая гласная в японском алфавите',
          explanation: 'あ — хирагана для звука "a". Происходит от упрощённого написания 安.',
        },
        {
          id: 'task-2',
          type: 'typing',
          prompt: 'Напиши хирагану для "ka"',
          options: [],
          correctAnswer: 'か',
          hint: 'Одна черта, потом крестик',
          explanation: 'ka = か. Иероглиф происходит от 加.',
        },
        {
          id: 'task-3',
          type: 'multiple',
          prompt: 'Какие символы — хирагана?',
          options: ['あ', 'ア', 'い', 'イ', 'う', 'ウ'],
          correctAnswer: 'あ,い,う',
          hint: 'Хирагана — более округлая, катакана — угловатая',
          explanation: 'あ・い・う — хирагана. ア・イ・ウ — катакана.',
        },
        {
          id: 'task-4',
          type: 'translation',
          prompt: 'Переведи на русский: "ありがとう"',
          options: [],
          correctAnswer: 'спасибо',
          hint: 'Говорят когда благодарят',
          explanation: 'ありがとう (arigatou) — спасибо. Вежливая форма.',
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
          explanation: 'ka = か. Попробуй ещё раз.',
        },
      ],
      sessionSummary: { correct: 1, total: 2, accuracy: 50 },
    }),
  ),

  http.post(`${v1}/chat`, async ({ request }) => {
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

  http.get(`${v1}/stats`, () =>
    HttpResponse.json({
      labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      accuracy: [60, 75, 80, 65, 90, 85, 70],
      tasksPerDay: [5, 8, 10, 6, 12, 9, 7],
    }),
  ),
]
