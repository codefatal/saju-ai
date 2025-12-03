import React, { useState } from 'react';
import LuckyDayForm from '../components/LuckyDayForm';
import LuckyDayResult from '../components/LuckyDayResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { findLuckyDays } from '../api/sajuApi';

const LuckyDayPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await findLuckyDays(formData);
      setResult(response);
    } catch (err) {
      console.error('Lucky day search failed:', err);
      setError(err.message || '길일 선택에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-900 to-emerald-950 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            📅 길일 선택
          </h1>
          <p className="text-xl text-green-200">
            좋은 날을 선택하여 일을 시작하세요
          </p>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <Loading message="길일을 찾고 있습니다..." />
          </div>
        )}

        {!isLoading && !result && <LuckyDayForm onSubmit={handleSubmit} isLoading={isLoading} />}

        {!isLoading && result && (
          <>
            <LuckyDayResult result={result} />
            <div className="max-w-3xl mx-auto mt-8">
              <button
                onClick={handleReset}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-emerald-700 transition-all"
              >
                다른 날짜로 찾기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LuckyDayPage;
