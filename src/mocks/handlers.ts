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
  { kanji: '食べる', kana: 'たべる', meaning: 'есть' },
  { kanji: '飲む', kana: 'のむ', meaning: 'пить' },
  { kanji: '行く', kana: 'いく', meaning: 'идти' },
  { kanji: '見る', kana: 'みる', meaning: 'смотреть' },
  { kanji: '聞く', kana: 'きく', meaning: 'слушать' },
  { kanji: '話す', kana: 'はなす', meaning: 'говорить' },
  { kanji: '読む', kana: 'よむ', meaning: 'читать' },
  { kanji: '書く', kana: 'かく', meaning: 'писать' },
  { kanji: '勉強', kana: 'べんきょう', meaning: 'учёба' },
  { kanji: '友達', kana: 'ともだち', meaning: 'друг' },
  { kanji: '私', kana: 'わたし', meaning: 'я' },
  { kanji: 'あなた', kana: 'あなた', meaning: 'ты' },
  { kanji: '大きい', kana: 'おおきい', meaning: 'большой' },
  { kanji: '小さい', kana: 'ちいさい', meaning: 'маленький' },
  { kanji: '新しい', kana: 'あたらしい', meaning: 'новый' },
  { kanji: '美味しい', kana: 'おいしい', meaning: 'вкусный' },
  { kanji: '楽しい', kana: 'たのしい', meaning: 'весёлый' },
  { kanji: '猫', kana: 'ねこ', meaning: 'кошка' },
  { kanji: '犬', kana: 'いぬ', meaning: 'собака' },
  { kanji: '水', kana: 'みず', meaning: 'вода' },
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
]

const taskGroups = [
  {
    id: 'group-kana',
    name: 'Азбука',
    description: 'Хирагана и катакана: чтение, написание, распознавание',
    taskCount: 8,
  },
  {
    id: 'group-basics',
    name: 'Основы',
    description: 'Приветствия, базовая грамматика, простые предложения',
    taskCount: 6,
  },
  {
    id: 'group-vocab',
    name: 'Cлова',
    description: 'Расширение словарного запаса (из словаря)',
    taskCount: 10,
  },
  {
    id: 'group-grammar',
    name: 'Грамматика',
    description: 'Порядок слов, частицы, спряжение глаголов',
    taskCount: 5,
  },
  {
    id: 'group-practice',
    name: 'Практика',
    description: 'Смешанные задания + разговор с AI',
    taskCount: 7,
  },
]

const kanaTasks = [
  { type: 'choice', prompt: 'Как читается あ?', options: ['a', 'i', 'u', 'e'], correctAnswer: 'a', hint: 'Первая гласная', explanation: 'あ = a' },
  { type: 'choice', prompt: 'Как читается か?', options: ['ka', 'ki', 'ku', 'ke'], correctAnswer: 'ka', hint: 'k + a', explanation: 'か = ka' },
  { type: 'typing', prompt: 'Напиши хирагану для "sa"', correctAnswer: 'さ', hint: 'Одна черта слева, крючок справа', explanation: 'さ = sa' },
  { type: 'choice', prompt: 'Это хирагана или катакана? ア', options: ['Хирагана', 'Катакана'], correctAnswer: 'Катакана', hint: 'Угловатая', explanation: 'ア — катакана (a)' },
  { type: 'typing', prompt: 'Напиши катакану для "ta"', correctAnswer: 'タ', hint: 'Угловатая форма', explanation: 'タ = ta' },
  { type: 'multiple', prompt: 'Выбери хирагану', options: ['い', 'イ', 'う', 'ウ', 'え', 'エ'], correctAnswer: 'い,う,え', hint: 'Округлые, не угловатые', explanation: 'い・う・え — хирагана' },
  { type: 'draw', prompt: 'Нарисуй хирагану "あ"', correctAnswer: 'あ', hint: 'Три черты', explanation: 'あ пишется тремя чертами.' },
  { type: 'multiple', prompt: 'Выбери катакану', options: ['ア', 'あ', 'カ', 'か', 'サ', 'さ'], correctAnswer: 'ア,カ,サ', hint: 'Угловатые', explanation: 'ア・カ・サ — катакана' },
].map((t, i) => ({ ...t, id: `kana-${i + 1}`, skipped: 0 }))

const statsByPeriod: Record<string, any> = {
  week:  { labels: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], accuracy: [60,75,80,65,90,85,70], minutes: [15,25,30,10,45,35,20], tasksPerDay: [5,8,10,6,12,9,7] },
  month: { labels: ['1 нед','2 нед','3 нед','4 нед'], accuracy: [72,78,82,75], minutes: [140,160,190,155], tasksPerDay: [45,52,58,48] },
  '3m':  { labels: ['Июнь','Июль','Август'], accuracy: [65,75,80], minutes: [520,580,640], tasksPerDay: [180,200,220] },
  '6m':  { labels: ['Март','Апр','Май','Июнь','Июль','Авг'], accuracy: [55,60,68,72,78,80], minutes: [400,450,500,520,580,640], tasksPerDay: [140,155,170,180,200,220] },
  year:  { labels: ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'], accuracy: [40,45,50,55,60,65,68,72,75,78,80,82], minutes: [200,250,300,400,450,500,520,580,640,680,700,750], tasksPerDay: [60,80,100,140,155,170,180,200,220,230,240,260] },
}

export const handlers = [
  http.get('/api/v1/profile', () =>
    HttpResponse.json({
      id: '1', name: 'Изучающий', level: 'beginner',
      kanaProgress: { hiragana: 65, katakana: 30 },
      streakDays: 3, totalStudyMinutes: 145,
    }),
  ),

  http.get('/api/v1/dashboard', () =>
    HttpResponse.json({
      todayMinutes: 15, todayTasks: 8, todayAccuracy: 75,
      streakDays: 3, hasActiveSession: false,
      hiragana: 65, katakana: 30,
    }),
  ),

  http.get('/api/v1/task-groups', () => HttpResponse.json(taskGroups)),

  http.post('/api/v1/session/start', async ({ request }) => {
    const body = await request.json().catch(() => ({})) as any
    const groupId = body?.groupId ?? null

    let tasks: any[]
    if (groupId === 'group-kana') {
      tasks = kanaTasks.map((t) => ({ ...t }))
    } else {
      tasks = [
        { id: 'task-1', type: 'choice', prompt: 'Как читается あ?', options: ['a','i','u','e'], correctAnswer: 'a', hint: 'Первая гласная', explanation: 'あ = a', skipped: 0 },
        { id: 'task-2', type: 'gapfill', prompt: 'Вставь: "私は ___ です (я — студент)"', options: ['学生','先生','会社員','医者'], correctAnswer: '学生', hint: 'がくせい', explanation: '学生 = студент.', skipped: 0 },
        { id: 'task-3', type: 'conversation', prompt: 'Поздоровайся и представься по-японски', correctAnswer: 'conversation_done', hint: 'こんにちは、私は〜です', explanation: 'Привет, я ...', skipped: 0 },
        { id: 'task-4', type: 'picture_choice', prompt: 'Что это? 🏀', options: ['Баскетбол','Футбол','Теннис','Бейсбол'], correctAnswer: 'Баскетбол', hint: 'Кольцо, мяч', explanation: '🏀 баскетбол', skipped: 0 },
        { id: 'task-5', type: 'drag', prompt: 'Порядок: "я / студент / есть"', slots: ['___','___','___'], options: ['私は','学生','です'], correctAnswer: '私は,学生,です', hint: 'SOV', explanation: '私は学生です', skipped: 0 },
        { id: 'task-6', type: 'draw', prompt: 'Нарисуй хирагану "あ"', correctAnswer: 'あ', hint: 'Три черты', explanation: 'あ тремя чертами.', skipped: 0 },
        { id: 'task-7', type: 'typing', prompt: 'Скажи "спасибо" по-японски (хираганой)', correctAnswer: 'ありがとう', hint: 'arigatou', explanation: 'ありがとう — спасибо', skipped: 0 },
        { id: 'task-8', type: 'multiple', prompt: 'Выбери хирагану', options: ['あ','ア','い','イ','う','ウ'], correctAnswer: 'あ,い,う', hint: 'Округлые', explanation: 'あ・い・う — хирагана', skipped: 0 },
      ]
    }

    return HttpResponse.json({
      id: `session-${Date.now()}`,
      startedAt: new Date().toISOString(),
      tasks,
    })
  }),

  http.post('/api/v1/session/:id/submit', () =>
    HttpResponse.json({
      results: [{ taskId: 'task-1', correct: true, explanation: 'Верно!' }],
      sessionSummary: { correct: 1, total: 1, accuracy: 100 },
    }),
  ),

  http.post('/api/v1/chat', async ({ request }) => {
    const body = (await request.json()) as { messages: { text: string }[] }
    const last = body.messages?.at(-1)?.text ?? ''
    const uwu = last.toLowerCase().includes('kawaii') || last.toLowerCase().includes('кавай') || last.toLowerCase().includes('мил')
    const reply = uwu ? 'かわいい〜! 💖' : chatReplies[Math.floor(Math.random() * chatReplies.length)]
    return HttpResponse.json({ reply })
  }),

  http.get('/api/v1/stats', ({ request }) => {
    const url = new URL(request.url)
    const period = url.searchParams.get('period') ?? 'week'
    return HttpResponse.json(statsByPeriod[period] ?? statsByPeriod.week)
  }),

  http.get('/api/v1/vocabulary', ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') ?? '1')
    const filter = url.searchParams.get('filter') ?? 'all'
    const search = url.searchParams.get('search') ?? ''
    const pageSize = 100

    let words = sampleWords.map((w, i) => ({
      id: `word-${i + 1}`, ...w,
      knowledge: Math.min(100, Math.max(5, Math.round(10 + Math.random() * 80))),
    }))

    if (search) {
      const q = search.toLowerCase()
      words = words.filter(w => w.kanji.includes(q) || w.kana.includes(q) || w.meaning.toLowerCase().includes(q))
    }
    if (filter === 'poor') words = words.filter(w => w.knowledge < 40)
    if (filter === 'medium') words = words.filter(w => w.knowledge >= 40 && w.knowledge < 70)
    if (filter === 'good') words = words.filter(w => w.knowledge >= 70)

    const total = words.length
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize

    return HttpResponse.json({ words: words.slice(start, start + pageSize), total, page, totalPages })
  }),
]
