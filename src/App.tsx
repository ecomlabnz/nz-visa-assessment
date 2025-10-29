import { useState } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import GatewayTest from './components/assessment/GatewayTest';
import EmailCapture from './components/results/EmailCapture';
import DetailedAssessment from './components/assessment/DetailedAssessment';
import { sendAssessmentEmail } from './lib/email';
import type { GatewayResult, AssessmentAnswers, DetailedResult } from './types/assessment';
import './index.css';

function App() {
  // State management - tracks what the user sees
  const [stage, setStage] = useState<'gateway' | 'email-capture' | 'detailed'>('gateway');
  const [gatewayResult, setGatewayResult] = useState<GatewayResult | null>(null);
  const [gatewayAnswers, setGatewayAnswers] = useState<AssessmentAnswers>({});
  const [userEmail, setUserEmail] = useState('');
  const [detailedResult, setDetailedResult] = useState<DetailedResult | null>(null);

  // When user completes gateway test
  const handleGatewayComplete = (result: GatewayResult, answers: AssessmentAnswers) => {
    setGatewayResult(result);
    setGatewayAnswers(answers);
    
    if (result.eligible) {
      // Move to email capture (then detailed assessment)
      setStage('email-capture');
    }
    // If not eligible, they stay on gateway results
  };

  // When user submits email
  const handleEmailSubmit = (email: string) => {
    setUserEmail(email);
    setStage('detailed');
  };

  // When user completes detailed assessment
  const handleDetailedComplete = async (result: DetailedResult, answers: AssessmentAnswers) => {
    setDetailedResult(result);
    
    // Send email report
    try {
      await sendAssessmentEmail({
        email: userEmail,
        gatewayResult: gatewayResult || undefined,
        detailedResult: result,
        timestamp: new Date(),
      });
      console.log('✓ Email report sent successfully');
    } catch (error) {
      console.error('✗ Failed to send email:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Business Investor Visa Assessment
            </h2>
            <p className="text-gray-600">
              Find out if you qualify for New Zealand's Business Investor Visa ($1M-$2M)
            </p>
          </div>
          
          {/* Gateway Test Stage */}
          {stage === 'gateway' && (
            <GatewayTest onComplete={handleGatewayComplete} />
          )}

          {/* Email Capture Stage */}
          {stage === 'email-capture' && gatewayResult && (
            <EmailCapture 
              onSubmit={handleEmailSubmit}
              result={gatewayResult}
            />
          )}

          {/* Detailed Assessment Stage */}
          {stage === 'detailed' && (
            <DetailedAssessment 
              email={userEmail}
              onComplete={handleDetailedComplete}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;