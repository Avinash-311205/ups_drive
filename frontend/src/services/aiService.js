import { apiRequest } from './apiService'

export async function askAssistant(message) {
  const data = await apiRequest('/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ message })
  })

  return data.reply
}
