import React, { useState } from 'react';
import TojeongForm from '../components/TojeongForm';
import TojeongResult from '../components/TojeongResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getTojeongFortune } from '../api/sajuApi';

const TojeongPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getTojeongFortune(formData);
      setResult(response);
    } catch (err) {
      console.error('Tojeong fortune failed:', err);
      setError(err.message || '토정비결 조회에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-950 via-yellow-900 to-orange-950 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📖 토정비결
          </h1>
          <p className="text-xl text-amber-200">
            전통 토정비결로 한 해의 운을 확인하세요
          </p>
        </div>

        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <Loading message="토정비결을 보고 있습니다..." />
          </div>
        )}

        {!isLoading && !result && <TojeongForm onSubmit={handleSubmit} isLoading={isLoading} />}

        {!isLoading && result && (
          <>
            <TojeongResult result={result} />
            <div className="max-w-2xl mx-auto mt-8">
              <button
                onClick={handleReset}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all"
              >
                다른 연도 보기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TojeongPage;
