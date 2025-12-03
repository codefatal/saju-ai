import React, { useState } from 'react';
import TarotForm from '../components/TarotForm';
import TarotResult from '../components/TarotResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { getTarotReading } from '../api/sajuApi';

const TarotPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getTarotReading(formData);
      setResult(response);
    } catch (err) {
      console.error('Tarot reading failed:', err);
      setError(
        err.message || '타로 리딩에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 py-12 px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🔮 타로 카드 리딩
          </h1>
          <p className="text-xl text-purple-200">
            과거-현재-미래를 비추는 신비로운 타로 카드의 메시지
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-2xl mx-auto">
            <Loading message="타로 카드를 펼치는 중입니다..." />
            <div className="mt-8 text-center">
              <p className="text-purple-200 text-lg mb-4">
                ✨ 카드들이 당신의 질문에 답하기 위해 준비하고 있습니다...
              </p>
              <div className="flex justify-center gap-4">
                <div className="animate-bounce delay-0">🌙</div>
                <div className="animate-bounce delay-100">⭐</div>
                <div className="animate-bounce delay-200">✨</div>
              </div>
            </div>
          </div>
        )}

        {/* Form or Result */}
        {!isLoading && !result && <TarotForm onSubmit={handleSubmit} isLoading={isLoading} />}

        {!isLoading && result && (
          <>
            <TarotResult result={result} />
            <div className="max-w-2xl mx-auto mt-8">
              <button
                onClick={handleReset}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                새로운 질문하기
              </button>
            </div>
          </>
        )}
      </div>

      <style>{`
        .delay-0 {
          animation-delay: 0s;
        }
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
      `}</style>
    </div>
  );
};

export default TarotPage;
