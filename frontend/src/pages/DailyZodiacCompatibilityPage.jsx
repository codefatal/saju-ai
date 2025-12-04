import { useState } from 'react';
import { getDailyZodiacCompatibility } from '../api/sajuApi';
import ZodiacSelector from '../components/ZodiacSelector';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { FaHeart, FaStar, FaExclamationTriangle } from 'react-icons/fa';

const DailyZodiacCompatibilityPage = () => {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (zodiac) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDailyZodiacCompatibility({ zodiac });
      setResult(data);
    } catch (err) {
      console.error('띠별 오늘의 궁합 조회 실패:', err);
      setError('띠별 오늘의 궁합을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-pink-400 to-red-500';
    if (score >= 80) return 'from-purple-400 to-pink-500';
    if (score >= 70) return 'from-blue-400 to-purple-500';
    if (score >= 60) return 'from-green-400 to-blue-500';
    if (score >= 50) return 'from-yellow-400 to-green-500';
    return 'from-gray-400 to-yellow-500';
  };

  const zodiacEmojis = {
    '쥐': '🐭', '소': '🐮', '호랑이': '🐯', '토끼': '🐰',
    '용': '🐲', '뱀': '🐍', '말': '🐴', '양': '🐑',
    '원숭이': '🐵', '닭': '🐔', '개': '🐶', '돼지': '🐷'
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            💕 띠별 오늘의 궁합
          </h1>
          <p className="text-lg text-gray-600">
            오늘 어떤 띠와 잘 맞을까요?
          </p>
        </div>

        {/* 띠 선택 */}
        {!result && !isLoading && (
          <ZodiacSelector onSelect={handleSubmit} />
        )}

        {/* 에러 메시지 */}
        {error && (
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        )}

        {/* 결과 표시 */}
        {result && !isLoading && (
          <div className="space-y-8 animate-fade-in">
            {/* 내 띠 정보 */}
            <div className="card bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="text-center">
                <div className="text-7xl mb-4">{zodiacEmojis[result.myZodiac]}</div>
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  {result.myZodiac}띠 ({result.myZodiacCharacter})
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {result.todayMessage}
                </p>
                <p className="text-sm text-gray-500 mt-2">{result.date}</p>
              </div>
            </div>

            {/* 최고/최악 궁합 하이라이트 */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* 최고 궁합 */}
              <div className="card bg-gradient-to-br from-pink-100 to-red-100 border-2 border-pink-300">
                <div className="flex items-center space-x-3 mb-4">
                  <FaHeart className="text-3xl text-red-500" />
                  <h3 className="text-2xl font-bold text-red-700">오늘의 최고 궁합</h3>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2">{zodiacEmojis[result.bestMatch]}</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {result.bestMatch}띠
                  </div>
                  <p className="text-gray-600 mt-2">
                    적극적으로 교류하고 함께 시간을 보내세요!
                  </p>
                </div>
              </div>

              {/* 최악 궁합 */}
              <div className="card bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300">
                <div className="flex items-center space-x-3 mb-4">
                  <FaExclamationTriangle className="text-3xl text-orange-500" />
                  <h3 className="text-2xl font-bold text-orange-700">오늘 주의할 띠</h3>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2">{zodiacEmojis[result.worstMatch]}</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {result.worstMatch}띠
                  </div>
                  <p className="text-gray-600 mt-2">
                    신중하게 대하고 불필요한 충돌을 피하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 12띠 전체 궁합 */}
            <div className="card">
              <div className="flex items-center space-x-3 mb-6">
                <FaStar className="text-3xl text-yellow-500" />
                <h3 className="text-2xl font-bold text-gray-800">12띠별 상세 궁합</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.compatibilities.map((comp, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 transition-shadow hover:shadow-lg ${
                      comp.isBestMatch
                        ? 'bg-pink-50 border-pink-300'
                        : comp.isWorstMatch
                        ? 'bg-orange-50 border-orange-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl">{zodiacEmojis[comp.zodiac]}</span>
                        <div>
                          <div className="font-bold text-gray-800">
                            {comp.zodiac}띠
                          </div>
                          <div className="text-xs text-gray-500">{comp.zodiacCharacter}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-700">
                          {comp.score}
                        </div>
                        <div className="text-xs text-gray-500">점</div>
                      </div>
                    </div>

                    {/* 점수 바 */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full bg-gradient-to-r ${getScoreColor(comp.score)}`}
                        style={{ width: `${comp.score}%` }}
                      />
                    </div>

                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      {comp.relationship}
                    </div>
                    <div className="text-xs text-gray-600">
                      {comp.advice}
                    </div>

                    {comp.isBestMatch && (
                      <div className="mt-2 text-xs font-bold text-pink-600 flex items-center">
                        <FaHeart className="mr-1" /> 최고 궁합
                      </div>
                    )}
                    {comp.isWorstMatch && (
                      <div className="mt-2 text-xs font-bold text-orange-600 flex items-center">
                        <FaExclamationTriangle className="mr-1" /> 주의 필요
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 안내 */}
            <div className="card bg-blue-50 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-3">💡 궁합 안내</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• 오늘의 궁합은 날짜에 따라 매일 달라집니다.</li>
                <li>• 점수가 높을수록 오늘 그 띠와의 관계가 좋습니다.</li>
                <li>• 평소 궁합과 오늘의 운세가 결합된 결과입니다.</li>
                <li>• 참고용으로 활용하시고 실제 관계는 진심으로 대하세요!</li>
              </ul>
            </div>

            {/* 다른 띠 보기 버튼 */}
            <div className="text-center">
              <button
                onClick={handleNewAnalysis}
                className="btn-primary text-xl px-12 py-4"
              >
                다른 띠 보기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyZodiacCompatibilityPage;
