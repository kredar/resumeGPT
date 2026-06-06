import ReactMarkdown from 'react-markdown'
import { Message } from '../types'

interface ChatMessageProps {
  message: Message
  isDarkMode: boolean
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 message-animate`}>
      <div
        className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
          isUser
            ? 'bg-teal-600 text-white'
            : isDarkMode
              ? 'bg-slate-800 text-slate-100 border border-slate-700'
              : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <ReactMarkdown
          className="message-content prose prose-sm max-w-none"
          components={{
            p: ({children}) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
            strong: ({children}) => <strong className={isUser ? 'font-semibold text-white' : 'font-semibold text-teal-400'}>{children}</strong>,
            ul: ({children}) => <ul className="mb-3 last:mb-0 space-y-1 list-disc list-inside">{children}</ul>,
            ol: ({children}) => <ol className="mb-3 last:mb-0 space-y-1 list-decimal list-inside">{children}</ol>,
            li: ({children}) => <li className="leading-relaxed">{children}</li>,
            h1: ({children}) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
            h2: ({children}) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
            h3: ({children}) => <h3 className="text-base font-bold mb-2">{children}</h3>,
            code: ({children}) => <code className={`px-1.5 py-0.5 rounded text-sm ${isUser ? 'bg-teal-700' : isDarkMode ? 'bg-slate-700 text-teal-400' : 'bg-gray-100 text-teal-600'}`}>{children}</code>,
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
