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

const sampleWords = [
  { kanji: '学生', kana: 'がくせい', meaning: 'студент' },
  { kanji: '先生', kana: 'せんせい', meaning: 'учитель' },
  { kanji: '学校', kana: 'がっこう', meaning: 'школа' },
  { kanji: '日本語', kana: 'にほんご', meaning: 'японский язык' },
  { kanji: '食べる', kana: 'たべる', meaning: 'есть (кушать)' },
  { kanji: '飲む', kana: 'のむ', meaning: 'пить' },
  { kanji: '行く', kana: 'いく', meaning: 'идти' },
  { kanji: '来る', kana: 'くる', meaning: 'приходить' },
  { kanji: '見る', kana: 'みる', meaning: 'смотреть' },
  { kanji: '聞く', kana: 'きく', meaning: 'слушать' },
  { kanji: '話す', kana: 'はなす', meaning: 'говорить' },
  { kanji: '読む', kana: 'よむ', meaning: 'читать' },
  { kanji: '書く', kana: 'かく', meaning: 'писать' },
  { kanji: '勉強', kana: 'べんきょう', meaning: 'учёба' },
  { kanji: '友達', kana: 'ともだち', meaning: 'друг' },
  { kanji: '家族', kana: 'かぞく', meaning: 'семья' },
  { kanji: '私', kana: 'わたし', meaning: 'я' },
  { kanji: 'あなた', kana: 'あなた', meaning: 'ты' },
  { kanji: '大きい', kana: 'おおきい', meaning: 'большой' },
  { kanji: '小さい', kana: 'ちいさい', meaning: 'маленький' },
  { kanji: '新しい', kana: 'あたらしい', meaning: 'новый' },
  { kanji: '古い', kana: 'ふるい', meaning: 'старый' },
  { kanji: '美味しい', kana: 'おいしい', meaning: 'вкусный' },
  { kanji: '楽しい', kana: 'たのしい', meaning: 'весёлый' },
  { kanji: '辛い', kana: 'からい', meaning: 'острый' },
  { kanji: '安い', kana: 'やすい', meaning: 'дешёвый' },
  { kanji: '高い', kana: 'たかい', meaning: 'дорогой/высокий' },
  { kanji: '猫', kana: 'ねこ', meaning: 'кошка' },
  { kanji: '犬', kana: 'いぬ', meaning: 'собака' },
  { kanji: '水', kana: 'みず', meaning: 'вода' },
  { kanji: '火', kana: 'ひ', meaning: 'огонь' },
  { kanji: '山', kana: 'やま', meaning: 'гора' },
  { kanji: '川', kana: 'かわ', meaning: 'река' },
  { kanji: '花', kana: 'はな', meaning: 'цветок' },
  { kanji: '雨', kana: 'あめ', meaning: 'дождь' },
  { kanji: '天気', kana: 'てんき', meaning: 'погода' },
  { kanji: '時間', kana: 'じかん', meaning: 'время' },
  { kanji: '今日', kana: 'きょう', meaning: 'сегодня' },
  { kanji: '明日', kana: 'あした', meaning: 'завтра' },
  { kanji: '昨日', kana: 'きのう', meaning: 'вчера' },
  { kanji: '毎日', kana: 'まいにち', meaning: 'каждый день' },
  { kanji: '毎週', kana: 'まいしゅう', meaning: 'каждую неделю' },
  { kanji: '毎月', kana: 'まいつき', meaning: 'каждый месяц' },
  { kanji: '今年', kana: 'ことし', meaning: 'этот год' },
  { kanji: '来年', kana: 'らいねん', meaning: 'следующий год' },
  { kanji: '去年', kana: 'きょねん', meaning: 'прошлый год' },
  { kanji: '月曜日', kana: 'げつようび', meaning: 'понедельник' },
  { kanji: '火曜日', kana: 'かようび', meaning: 'вторник' },
  { kanji: '水曜日', kana: 'すいようび', meaning: 'среда' },
  { kanji: '木曜日', kana: 'もくようび', meaning: 'четверг' },
  { kanji: '金曜日', kana: 'きんようび', meaning: 'пятница' },
  { kanji: '土曜日', kana: 'どようび', meaning: 'суббота' },
  { kanji: '日曜日', kana: 'にちようび', meaning: 'воскресенье' },
]

const statsByPeriod: Record<string, { labels: string[]; accuracy: number[]; minutes: number[]; tasksPerDay: number[] }> = {
  week: {
    labels: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    accuracy: [60, 75, 80, 65, 90, 85, 70],
    minutes: [15, 25, 30, 10, 45, 35, 20],
    tasksPerDay: [5, 8, 10, 6, 12, 9, 7],
  },
  month: {
    labels: ['1 нед', '2 нед', '3 нед', '4 нед'],
    accuracy: [72, 78, 82, 75],
    minutes: [140, 160, 190, 155],
    tasksPerDay: [45, 52, 58, 48],
  },
  '3m': {
    labels: ['Июнь', 'Июль', 'Август'],
    accuracy: [65, 75, 80],
    minutes: [520, 580, 640],
    tasksPerDay: [180, 200, 220],
  },
  '6m': {
    labels: ['Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг'],
    accuracy: [55, 60, 68, 72, 78, 80],
    minutes: [400, 450, 500, 520, 580, 640],
    tasksPerDay: [140, 155, 170, 180, 200, 220],
  },
  year: {
    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    accuracy: [40, 45, 50, 55, 60, 65, 68, 72, 75, 78, 80, 82],
    minutes: [200, 250, 300, 400, 450, 500, 520, 580, 640, 680, 700, 750],
    tasksPerDay: [60, 80, 100, 140, 155, 170, 180, 200, 220, 230, 240, 260],
  },
}

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
          id: 'task-1', type: 'choice', prompt: 'Как читается あ?',
          options: ['a', 'i', 'u', 'e'], correctAnswer: 'a',
          hint: 'Первая гласная', explanation: 'あ — хирагана для звука "a".',
          skipped: 0,
        },
        {
          id: 'task-2', type: 'gapfill', prompt: 'Вставь: "私は ___ です (я — студент)"',
          options: ['学生', '先生', '会社員', '医者'], correctAnswer: '学生',
          hint: 'がくせい — студент', explanation: '学生 (がくせい) — студент.',
          skipped: 0,
        },
        {
          id: 'task-3', type: 'picture_choice', prompt: 'Что это? 🏀',
          options: ['Баскетбол', 'Футбол', 'Теннис', 'Бейсбол'], correctAnswer: 'Баскетбол',
          hint: 'Оранжевый мяч, кольцо',
          explanation: '🏀 — баскетбол. По-японски: バスケットボール.',
          skipped: 0,
        },
        {
          id: 'task-4', type: 'drag', prompt: 'Порядок слов: "я / студент / есть"',
          slots: ['___', '___', '___'], options: ['私は', '学生', 'です'],
          correctAnswer: '私は,学生,です', hint: 'SOV порядок',
          explanation: '私は学生です — я студент.',
          skipped: 0,
        },
        {
          id: 'task-5', type: 'draw', prompt: 'Нарисуй хирагану "あ"',
          correctAnswer: 'あ', hint: 'Три черты',
          explanation: 'あ пишется тремя чертами.',
          skipped: 0,
        },
        {
          id: 'task-6', type: 'conversation',
          prompt: 'Поздоровайся и представься по-японски. Напиши что-нибудь.',
          correctAnswer: 'conversation_done',
          hint: 'Попробуй: こんにちは、私は [имя] です',
          explanation: 'こんにちは — привет. 私は〜です — я ...',
          skipped: 0,
        },
      ],
    }),
  ),

  http.post('/api/v1/session/:id/submit', () =>
    HttpResponse.json({
      results: [
        { taskId: 'task-1', correct: true, explanation: 'Верно!' },
        { taskId: 'task-2', correct: false, explanation: 'Попробуй ещё.' },
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

  http.get('/api/v1/stats', ({ request }) => {
    const url = new URL(request.url)
    const period = url.searchParams.get('period') ?? 'week'
    return HttpResponse.json(
      statsByPeriod[period] ?? statsByPeriod.week,
    )
  }),

  http.get('/api/v1/vocabulary', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const filter = url.searchParams.get('filter') ?? 'all'
    const search = url.searchParams.get('search') ?? ''
    const pageSize = 100

    let words = sampleWords.map((w, i) => ({
      id: `word-${i + 1}`,
      ...w,
      knowledge: Math.min(100, Math.max(5, Math.round(10 + Math.random() * 80))),
    }))

    if (search) {
      const q = search.toLowerCase()
      words = words.filter(
        (w) =>
          w.kanji.includes(q) ||
          w.kana.includes(q) ||
          w.meaning.toLowerCase().includes(q),
      )
    }

    if (filter === 'poor') words = words.filter((w) => w.knowledge < 40)
    if (filter === 'medium') words = words.filter((w) => w.knowledge >= 40 && w.knowledge < 70)
    if (filter === 'good') words = words.filter((w) => w.knowledge >= 70)

    const total = words.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize
    const paginated = words.slice(start, start + pageSize)

    return HttpResponse.json({
      words: paginated,
      total,
      page,
      totalPages,
    })
  }),
]
