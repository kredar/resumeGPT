interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
  isDarkMode: boolean
}

export default function SuggestedQuestions({ questions, onQuestionClick, isDarkMode }: SuggestedQuestionsProps) {
  return (
    <div className="mb-4">
      <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-4 font-medium`}>
        What else would you like to know about Art?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className={`text-left px-5 py-3 ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 hover:border-slate-600' : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'} rounded-2xl border transition-all duration-200 text-sm`}
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
