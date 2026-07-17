export function speak(text: string, rate = 0.8) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ja-JP'
  u.rate = rate
  window.speechSynthesis.speak(u)
}

export function stopSpeaking() {
  window.speechSynthesis?.cancel()
}
