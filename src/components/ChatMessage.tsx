import ReactMarkdown from 'react-markdown'
import { Message } from '../types'

interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-6 py-4 shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-white text-gray-800 border border-gray-200'
        }`}
      >
        <ReactMarkdown className="message-content">
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )
}
