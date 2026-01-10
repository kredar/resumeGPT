import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import SuggestedQuestions from './components/SuggestedQuestions'
import { Message, ChatResponse } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID())
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What is Art Kreimer's educational background?",
    "Can you outline Art Kreimer's professional experience?",
    "What skills and expertise does Art Kreimer bring to the table?"
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `Welcome! I'm **Art's ResumeGPT**, specialized in providing information about Art Kreimer's professional background and qualifications.

Feel free to ask me questions such as:

- What is Art Kreimer's educational background?
- Can you outline Art Kreimer's professional experience?
- What skills and expertise does Art Kreimer bring to the table?

I'm here to assist you. What would you like to know?`
    }
    setMessages([welcomeMessage])
  }, [])

  const storeConversation = async (userMessage: string, botMessage: string, answered: boolean) => {
    try {
      await supabase.from('conversations').insert({
        conversation_id: conversationId,
        user_message: userMessage,
        bot_message: botMessage,
        answered
      })
    } catch (error) {
      console.error('Error storing conversation:', error)
    }
  }

  const sendMessage = async (messageText: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: messageText
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
          },
          body: JSON.stringify({
            message: messageText,
            conversationHistory
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data: ChatResponse = await response.json()

      let fullResponse = data.response
      if (!data.answered || data.response.includes("I am tuned to only answer questions")) {
        fullResponse = `Unfortunately, I can't answer this question. My capabilities are limited to providing information about Art Kreimer's professional background and qualifications. If you have other inquiries, I recommend reaching out to Art on [LinkedIn](https://www.linkedin.com/in/artkreimer/). I can answer questions like:\n- What is Art Kreimer's educational background?\n- Can you list Art Kreimer's professional experience?\n- What skills does Art Kreimer possess?`
      }

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fullResponse
      }

      setMessages(prev => [...prev, assistantMessage])
      setSuggestedQuestions(data.questions || [])

      await storeConversation(messageText, fullResponse, data.answered)
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm sorry, I'm experiencing technical difficulties. Please try again later."
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Art Kreimer's ResumeGPT
          </h1>
          <details className="mt-3">
            <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 font-medium">
              Disclaimer
            </summary>
            <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
              This is a work in progress chatbot based on a large language model.
              It can answer questions about Art Kreimer's professional background
              and qualifications.
            </p>
          </details>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-6 py-8">
          <div className="space-y-4 mb-8">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="max-w-[80%] rounded-2xl px-6 py-4 bg-white border border-gray-200 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!isLoading && suggestedQuestions.length > 0 && messages.length > 1 && (
            <SuggestedQuestions
              questions={suggestedQuestions}
              onQuestionClick={sendMessage}
            />
          )}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
        </div>
      </footer>
    </div>
  )
}

export default App
