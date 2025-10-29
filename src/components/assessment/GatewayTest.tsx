import { useState } from 'react';
import { GATEWAY_QUESTIONS } from '../../visa-types/business-investor/questions';
import { evaluateGateway } from '../../visa-types/business-investor/scoring';
import type { AssessmentAnswers, GatewayResult } from '../../types/assessment';

interface GatewayTestProps {
  onComplete: (result: GatewayResult, answers: AssessmentAnswers) => void;
}

export const GatewayTest = ({ onComplete }: GatewayTestProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<GatewayResult | null>(null);

  const question = GATEWAY_QUESTIONS[currentQuestion];
  const isLastQuestion = currentQuestion === GATEWAY_QUESTIONS.length - 1;
  const progress = ((currentQuestion + 1) / GATEWAY_QUESTIONS.length) * 100;

  const handleAnswer = (value: boolean) => {
    const newAnswers = {
      ...answers,
      [question.id]: value,
    };
    setAnswers(newAnswers);

    if (isLastQuestion) {
      // Evaluate and show results
      const evaluationResult = evaluateGateway(newAnswers);
      setResult(evaluationResult);
      setShowResult(true);
    } else {
      // Move to next question
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setResult(null);
  };

  if (showResult && result) {
    return (
      <div className="space-y-6">
        {/* Result Card */}
        <div className={`rounded-lg p-6 ${
          result.status === 'ELIGIBLE' 
            ? 'bg-green-50 border-2 border-green-500' 
            : result.status === 'MARGINAL'
            ? 'bg-yellow-50 border-2 border-yellow-500'
            : 'bg-red-50 border-2 border-red-500'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-bold">
              {result.status === 'ELIGIBLE' && '✓ You May Be Eligible!'}
              {result.status === 'MARGINAL' && '⚠ Marginal Eligibility'}
              {result.status === 'INELIGIBLE' && '✗ Not Eligible'}
            </h3>
            <span className="text-lg font-semibold">
              {result.passedChecks}/{result.totalChecks} criteria met
            </span>
          </div>

          {result.status === 'ELIGIBLE' && (
            <div className="space-y-3">
              <p className="text-green-800">
                Congratulations! You meet all the basic requirements for the Business Investor Visa.
              </p>
              <p className="text-green-700">
                <strong>Next step:</strong> Complete the detailed assessment to evaluate your specific situation 
                and identify any risk factors.
              </p>
            </div>
          )}

          {result.status === 'MARGINAL' && (
            <div className="space-y-3">
              <p className="text-yellow-800">
                You meet most requirements but failed one criterion. Review below to see what needs attention.
              </p>
              {result.failedCriteria.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-yellow-900">Failed criterion:</p>
                  <ul className="list-disc list-inside mt-2 text-yellow-800">
                    {result.failedCriteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {result.status === 'INELIGIBLE' && (
            <div className="space-y-3">
              <p className="text-red-800">
                Unfortunately, you do not meet the minimum requirements for this visa category.
              </p>
              {result.failedCriteria.length > 0 && (
                <div className="mt-3">
                  <p className="font-semibold text-red-900">Failed criteria:</p>
                  <ul className="list-disc list-inside mt-2 text-red-800">
                    {result.failedCriteria.map((criterion, idx) => (
                      <li key={idx}>{criterion}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-red-700 mt-4">
                Consider alternative visa pathways or address the failed criteria before reapplying.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {result.status === 'ELIGIBLE' && (
            <button
              onClick={() => onComplete(result, answers)}
              className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition"
            >
              Continue to Detailed Assessment →
            </button>
          )}
          <button
            onClick={handleRestart}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-sm text-gray-600">
        Question {currentQuestion + 1} of {GATEWAY_QUESTIONS.length}
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {question.text}
        </h3>

        {question.helpText && (
          <p className="text-sm text-gray-600 mb-6 bg-blue-50 p-3 rounded">
            ℹ️ {question.helpText}
          </p>
        )}

        {/* Yes/No Buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => handleAnswer(true)}
            className="flex-1 bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition transform hover:scale-105"
          >
            Yes
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="flex-1 bg-red-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-red-700 transition transform hover:scale-105"
          >
            No
          </button>
        </div>
      </div>

      {/* Back Button (if not first question) */}
      {currentQuestion > 0 && (
        <button
          onClick={() => setCurrentQuestion(currentQuestion - 1)}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Back
        </button>
      )}
    </div>
  );
};

export default GatewayTest;