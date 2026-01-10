interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
}

export default function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-slate-400 mb-4 font-medium">
        What else would you like to know about Art?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="text-left px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-200 text-sm"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
