import React, { useState } from 'react';
import DreamForm from '../components/DreamForm';
import DreamResult from '../components/DreamResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { interpretDream } from '../api/sajuApi';

const DreamPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await interpretDream(formData);
      setResult(response);
    } catch (err) {
      console.error('Dream interpretation failed:', err);
      setError(
        err.message || '꿈 해몽에 실패했습니다. 잠시 후 다시 시도해주세요.'
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
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-blue-900 to-indigo-950 py-12 px-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🌙 꿈 해몽
          </h1>
          <p className="text-xl text-indigo-200">
            당신의 꿈이 전하는 메시지를 들어보세요
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-3xl mx-auto mb-8">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-3xl mx-auto">
            <Loading message="꿈을 해석하고 있습니다..." />
            <div className="mt-8 text-center">
              <p className="text-indigo-200 text-lg mb-4">
                ✨ 심리학과 전통 해몽을 통해 꿈의 의미를 분석 중입니다...
              </p>
              <div className="flex justify-center gap-4">
                <div className="animate-bounce delay-0">🌙</div>
                <div className="animate-bounce delay-100">⭐</div>
                <div className="animate-bounce delay-200">💫</div>
              </div>
            </div>
          </div>
        )}

        {/* Form or Result */}
        {!isLoading && !result && <DreamForm onSubmit={handleSubmit} isLoading={isLoading} />}

        {!isLoading && result && (
          <>
            <DreamResult result={result} />
            <div className="max-w-3xl mx-auto mt-8">
              <button
                onClick={handleReset}
                className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                다른 꿈 해석하기
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

export default DreamPage;
