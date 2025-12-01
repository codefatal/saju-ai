import { useState } from 'react';
import BirthForm from '../components/BirthForm';
import SajuResult from '../components/SajuResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import useSajuStore from '../store/useSajuStore';

const AnalysisPage = () => {
  const [showResult, setShowResult] = useState(false);
  const { currentResult, isLoading, error, fetchAnalysis, clearError } = useSajuStore();

  const handleSubmit = async (birthData) => {
    try {
      await fetchAnalysis(birthData);
      setShowResult(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Analysis failed:', err);
    }
  };

  const handleNewAnalysis = () => {
    setShowResult(false);
    clearError();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {!showResult ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                사주 분석
              </h1>
              <p className="text-xl text-gray-600">
                정확한 생년월일시를 입력해주세요
              </p>
            </div>

            {error && (
              <div className="mb-8">
                <ErrorMessage message={error} onRetry={clearError} />
              </div>
            )}

            {isLoading ? (
              <Loading message="AI가 사주를 분석하고 있습니다..." />
            ) : (
              <BirthForm onSubmit={handleSubmit} isLoading={isLoading} />
            )}
          </>
        ) : (
          <>
            {currentResult && (
              <SajuResult result={currentResult} onNewAnalysis={handleNewAnalysis} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AnalysisPage;
