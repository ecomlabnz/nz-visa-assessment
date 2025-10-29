import { useState } from 'react';
import { DETAILED_QUESTIONS } from '../../visa-types/business-investor/questions';
import { evaluateDetailed, getRiskBand } from '../../visa-types/business-investor/scoring';
import type { AssessmentAnswers, DetailedResult } from '../../types/assessment';

interface DetailedAssessmentProps {
  email: string;
  onComplete: (result: DetailedResult, answers: AssessmentAnswers) => void;
}

export const DetailedAssessment = ({ email, onComplete }: DetailedAssessmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<DetailedResult | null>(null);

  const question = DETAILED_QUESTIONS[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / DETAILED_QUESTIONS.length) * 100;
  const isLastQuestion = currentQuestionIndex === DETAILED_QUESTIONS.length - 1;

  const handleAnswer = (value: any) => {
    const newAnswers = {
      ...answers,
      [question.id]: value,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Evaluate and show results
      const evaluationResult = evaluateDetailed(newAnswers);
      setResult(evaluationResult);
      setShowResults(true);
      onComplete(evaluationResult, newAnswers);
    } else {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSkip = () => {
    if (!question.required) {
      if (isLastQuestion) {
        const evaluationResult = evaluateDetailed(answers);
        setResult(evaluationResult);
        setShowResults(true);
        onComplete(evaluationResult, answers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  // Results View
  if (showResults && result) {
    const riskBand = getRiskBand(result.riskScore);

    return (
      <div className="space-y-6">
        {/* Score Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Your Assessment Results
          </h2>

          {/* Risk Score */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <div className="text-6xl font-bold mb-2" style={{ color: riskBand.color.replace('text-', '') }}>
                {result.riskScore}
                <span className="text-2xl text-gray-500">/100</span>
              </div>
              <div className={`text-xl font-semibold ${riskBand.color}`}>
                {riskBand.label}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {riskBand.description}
              </p>
            </div>
          </div>

          {/* Pathway */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-1">Recommended Pathway</h3>
            <p className="text-blue-800">
              {result.pathway === 'fast_track' && 'Fast Track: 12-month pathway to residence (investment $2M+)'}
              {result.pathway === 'standard' && 'Standard: 3-year pathway to residence (investment $1M-$2M)'}
              {result.pathway === 'ineligible' && 'Not eligible for this visa category at this time'}
            </p>
          </div>

          {/* Strengths */}
          {result.strengths.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-2">
                {result.strengths.map((strength, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Concerns */}
          {result.concerns.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Concerns
              </h3>
              <ul className="space-y-2">
                {result.concerns.map((concern, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-orange-500 mr-2">⚠</span>
                    {concern}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Recommendations
              </h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-500 mr-2">→</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Email Confirmation */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4">
          <p className="text-sm text-green-800">
            ✓ Your detailed assessment report has been prepared and will be sent to <strong>{email}</strong>
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Next Steps</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <p>1. Check your email for the detailed report</p>
            <p>2. Review the recommendations carefully</p>
            <p>3. Contact us for professional consultation if needed</p>
          </div>
        </div>
      </div>
    );
  }

  // Question View
  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestionIndex + 1} of {DETAILED_QUESTIONS.length}
          </span>
          <span className="text-sm text-gray-500">{Math.round(progress)}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {question.text}
        </h3>

        {question.helpText && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-6">
            <p className="text-sm text-blue-800">
              ℹ️ {question.helpText}
            </p>
          </div>
        )}

        {/* Answer Input based on question type */}
        <div className="space-y-4">
          {/* Yes/No Questions */}
          {question.type === 'yes-no' && (
            <div className="flex gap-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                No
              </button>
            </div>
          )}

          {/* Number Input */}
          {question.type === 'number' && (
            <div>
              <input
                type="number"
                min={question.validation?.min}
                max={question.validation?.max}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Enter number"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = parseFloat((e.target as HTMLInputElement).value);
                    if (!isNaN(value)) handleAnswer(value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                  const value = parseFloat(input.value);
                  if (!isNaN(value)) handleAnswer(value);
                }}
                className="mt-3 w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Continue
              </button>
            </div>
          )}

          {/* Select/Dropdown */}
          {question.type === 'select' && question.options && (
            <div className="space-y-2">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Text Input */}
          {question.type === 'text' && (
            <div>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Type your answer"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const value = (e.target as HTMLInputElement).value;
                    if (value.trim()) handleAnswer(value);
                  }
                }}
              />
              <button
                onClick={(e) => {
                  const input = (e.target as HTMLButtonElement).previousElementSibling as HTMLInputElement;
                  const value = input.value;
                  if (value.trim()) handleAnswer(value);
                }}
                className="mt-3 w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition"
              >
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Skip button for optional questions */}
        {!question.required && (
          <button
            onClick={handleSkip}
            className="mt-4 text-gray-500 hover:text-gray-700 text-sm"
          >
            Skip (optional)
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentQuestionIndex === 0}
          className="text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
        >
          ← Back
        </button>
        <span className="text-sm text-gray-500">
          {currentQuestionIndex + 1} / {DETAILED_QUESTIONS.length}
        </span>
      </div>
    </div>
  );
};

export default DetailedAssessment;