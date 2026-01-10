interface LandingPageProps {
  onSendMessage: (message: string) => void
  isDarkMode: boolean
  onToggleTheme: () => void
}

export default function LandingPage({ onSendMessage, isDarkMode, onToggleTheme }: LandingPageProps) {
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'} flex flex-col`}>
      <div className="absolute top-6 right-6">
        <button
          onClick={onToggleTheme}
          className={`p-2.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-slate-200' : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'}`}
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
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-4xl w-full">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className={`w-20 h-20 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl flex items-center justify-center border`}>
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
              <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} max-w-xl mx-auto`}>
                An AI-powered assistant to explore Art Kreimer's professional background and qualifications
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className={`px-5 py-2.5 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-slate-600 text-slate-300' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'} border rounded-full text-sm transition-all duration-200 flex items-center gap-2`}
                >
                  <span className="text-base">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>

            <button className={`px-5 py-2.5 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-slate-600 text-slate-300' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'} border rounded-full text-sm transition-all duration-200 flex items-center gap-2`}>
              <span className="text-base">{secondaryCategory.icon}</span>
              <span>{secondaryCategory.label}</span>
            </button>

            <div className="pt-8 w-full">
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm mb-6`}>
                Try asking one of these questions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => onSendMessage(question)}
                    className={`px-5 py-3 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-slate-600 text-slate-300' : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300 text-gray-700'} border rounded-2xl text-sm transition-all duration-200 text-left`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`sticky bottom-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-gray-50 border-gray-200'} border-t px-6 py-6`}>
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
              className={`w-full px-6 py-4 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'} border rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent pr-16`}
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
          <p className={`text-center text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'} mt-3`}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
