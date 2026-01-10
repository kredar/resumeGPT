interface SuggestedQuestionsProps {
  questions: string[]
  onQuestionClick: (question: string) => void
}

export default function SuggestedQuestions({ questions, onQuestionClick }: SuggestedQuestionsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 mb-3 font-medium">
        What else would you like to know about Art?
      </p>
      <div className="space-y-2">
        {questions.map((question, index) => (
          <button
            key={index}
            onClick={() => onQuestionClick(question)}
            className="block w-full text-left px-4 py-3 bg-white hover:bg-blue-50 text-gray-700 rounded-xl border border-gray-200 transition-colors text-sm shadow-sm hover:shadow-md"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  )
}
