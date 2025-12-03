import { useState } from 'react';
import NameAnalysisForm from '../components/NameAnalysisForm';
import NameAnalysisResult from '../components/NameAnalysisResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { analyzeName } from '../api/sajuApi';

const NameAnalysisPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (nameData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await analyzeName(nameData);
      setResult(analysisResult);
    } catch (err) {
      console.error('이름 분석 실패:', err);
      setError(err.message || '이름 분석에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-purple-50 to-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">이름 풀이</h1>
          <p className="text-xl text-gray-600">
            성명학으로 이름의 의미와 운세를 분석합니다
          </p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6">
            <ErrorMessage message={error} onClose={() => setError(null)} />
          </div>
        )}

        {/* 로딩 */}
        {isLoading && (
          <div className="mb-6">
            <Loading message="이름을 분석하고 있습니다..." />
          </div>
        )}

        {/* 폼 또는 결과 */}
        {!result ? (
          <NameAnalysisForm onSubmit={handleSubmit} isLoading={isLoading} />
        ) : (
          <>
            <NameAnalysisResult result={result} />
            <div className="text-center mt-8">
              <button
                onClick={handleReset}
                className="btn-secondary px-8 py-3 bg-white border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 rounded-lg font-bold transition-all"
              >
                다른 이름 분석하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NameAnalysisPage;
