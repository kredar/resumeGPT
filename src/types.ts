export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  suggestedQuestions?: string[]
}

export interface ChatResponse {
  answered: boolean
  response: string
  questions: string[]
  responseId?: string
}
