interface LandingPageProps {
  onSendMessage: (message: string) => void
}

export default function LandingPage({ onSendMessage }: LandingPageProps) {
  const categories = [
    { icon: '💼', label: 'Professional Experience' },
    { icon: '🎓', label: 'Education & Certifications' },
    { icon: '</>', label: 'Technical Skills' },
  ]

  const secondaryCategory = { icon: '💬', label: 'Personal Interests' }

  const suggestedQuestions = [
    'Who is Art Kreimer?',
    'What is his professional experience?',
    'What are his technical skills?',
    'Tell me about his education',
    'What projects has he worked on?',
    'How can I contact him?',
  ]

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-700">
              <svg
                className="w-10 h-10 text-teal-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <rect x="8" y="8" width="8" height="8" rx="1" strokeWidth="2" />
                <path d="M8 12h-2m10 0h2m-6-6v-2m0 16v-2" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <div>
              <h1 className="text-5xl font-bold text-teal-400 mb-4">
                ResumeGPT
              </h1>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                An AI-powered assistant to explore Art Kreimer's professional background and qualifications
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-sm text-slate-300 transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <button className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-sm text-slate-300 transition-all duration-200 flex items-center gap-2">
              <span className="text-base">{secondaryCategory.icon}</span>
              <span>{secondaryCategory.label}</span>
            </button>

            <div className="pt-8 w-full">
              <p className="text-slate-400 text-sm mb-6">
                Try asking one of these questions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(question)}
                    className="px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-2xl text-sm text-slate-300 transition-all duration-200 text-left"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-slate-900 border-t border-slate-800 px-6 py-6">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement
              if (input.value.trim()) {
                onSendMessage(input.value.trim())
                input.value = ''
              }
            }}
            className="relative"
          >
            <input
              type="text"
              name="message"
              placeholder="Ask me anything about Art Kreimer..."
              className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-16"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  e.currentTarget.form?.requestSubmit()
                }
              }}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-teal-500 hover:bg-teal-600 rounded-xl flex items-center justify-center transition-colors"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
          <p className="text-center text-xs text-slate-500 mt-3">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
