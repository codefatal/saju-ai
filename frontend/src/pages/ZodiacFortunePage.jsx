import { useState } from 'react';
import ZodiacSelector from '../components/ZodiacSelector';
import ZodiacFortuneResult from '../components/ZodiacFortuneResult';
import { getZodiacFortune } from '../api/sajuApi';

const ZodiacFortunePage = () => {
  const [fortune, setFortune] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (zodiac) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getZodiacFortune({ zodiac });
      setFortune(result);
    } catch (err) {
      console.error('띠별 운세 조회 실패:', err);
      setError('띠별 운세를 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewFortune = () => {
    setFortune(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            띠별 운세
          </h1>
          <p className="text-lg text-gray-600">
            12띠별 오늘의 운세를 확인해보세요
          </p>
        </div>

        {!fortune && !isLoading && (
          <ZodiacSelector onSelect={handleSubmit} />
        )}

        {isLoading && (
          <div className="card text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-xl text-gray-600">운세를 분석하고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-600 text-center">{error}</p>
            <div className="text-center mt-4">
              <button onClick={handleNewFortune} className="btn-secondary">
                다시 시도하기
              </button>
            </div>
          </div>
        )}

        {fortune && !isLoading && (
          <ZodiacFortuneResult fortune={fortune} onNewFortune={handleNewFortune} />
        )}
      </div>
    </div>
  );
};

export default ZodiacFortunePage;
