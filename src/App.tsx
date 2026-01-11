import { useState, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'
import ChatMessage from './components/ChatMessage'
import ChatInput from './components/ChatInput'
import SuggestedQuestions from './components/SuggestedQuestions'
import LandingPage from './components/LandingPage'
import { Message, ChatResponse } from './types'

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId] = useState(() => crypto.randomUUID())
  const [showLanding, setShowLanding] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : false
  })
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What is Art Kreimer's educational background?",
    "Can you outline Art Kreimer's professional experience?",
    "What skills and expertise does Art Kreimer bring to the table?"
  ])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    if (showLanding) {
      setShowLanding(false)
    }

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

  if (showLanding) {
    return <LandingPage onSendMessage={sendMessage} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
  }

  return (
    <div className={`h-screen flex flex-col ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <header className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b shadow-sm flex-shrink-0`}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-gray-100 border-gray-300'} rounded-lg flex items-center justify-center border`}>
              <svg
                className="w-5 h-5 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="2" />
                <path d="M8 12h-2m10 0h2m-6-6v-2m0 16v-2" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-teal-400">
              ResumeGPT
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'}`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setShowLanding(true)
                setMessages([])
              }}
              className={`text-sm transition-colors ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Start Over
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-6 py-8 pb-32">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} isDarkMode={isDarkMode} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className={`max-w-[80%] rounded-2xl px-6 py-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border shadow-sm`}>
                  <div className="flex space-x-2">
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-teal-400' : 'bg-teal-500'} rounded-full animate-bounce`} />
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-teal-400' : 'bg-teal-500'} rounded-full animate-bounce delay-100`} />
                    <div className={`w-2 h-2 ${isDarkMode ? 'bg-teal-400' : 'bg-teal-500'} rounded-full animate-bounce delay-200`} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!isLoading && suggestedQuestions.length > 0 && messages.length > 0 && (
            <div className="mt-8">
              <SuggestedQuestions
                questions={suggestedQuestions}
                onQuestionClick={sendMessage}
                isDarkMode={isDarkMode}
              />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-t shadow-sm flex-shrink-0`}>
        <div className="max-w-4xl mx-auto px-6 py-6">
          <ChatInput onSendMessage={sendMessage} disabled={isLoading} isDarkMode={isDarkMode} />
        </div>
      </footer>
    </div>
  )
}

export default App
