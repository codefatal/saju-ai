import { useState } from 'react';
import CompatibilityForm from '../components/CompatibilityForm';
import CompatibilityResult from '../components/CompatibilityResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { analyzeCompatibility } from '../api/sajuApi';

const CompatibilityPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (compatibilityData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyzeCompatibility(compatibilityData);
      setResult(response);
    } catch (err) {
      console.error('Compatibility analysis error:', err);
      setError(err.message || '궁합 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {loading ? (
          <Loading message="궁합을 분석하고 있습니다..." />
        ) : result ? (
          <CompatibilityResult result={result} onNewAnalysis={handleNewAnalysis} />
        ) : (
          <CompatibilityForm onAnalyze={handleAnalyze} />
        )}
      </div>
    </div>
  );
};

export default CompatibilityPage;
