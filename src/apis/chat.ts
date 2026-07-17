import client from './client'

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
}

export async function sendMessage(
  messages: ChatMessage[],
): Promise<{ reply: string }> {
  const { data } = await client.post('/chat', { messages })
  return data
}
