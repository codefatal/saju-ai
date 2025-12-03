import { useState, useEffect } from 'react';
import { getDailyMessage } from '../api/sajuApi';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function DailyMessagePage() {
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDailyMessage();
  }, []);

  const fetchDailyMessage = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDailyMessage();
      setMessage(data);
    } catch (err) {
      setError(err.message || '오늘의 한마디를 불러올 수 없습니다.');
      console.error('오늘의 한마디 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {error ? (
          <ErrorMessage message={error} onRetry={fetchDailyMessage} />
        ) : message ? (
          <div className="space-y-6 animate-fade-in">
            {/* 제목 */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gradient mb-2">오늘의 한마디</h1>
              <p className="text-gray-600">사주 기반 오늘의 격려 메시지</p>
            </div>

            {/* 메인 메시지 카드 */}
            <div className="card bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-2xl hover:shadow-3xl transition-shadow">
              <div className="text-center py-12 px-6">
                <div className="text-6xl mb-6">{message.emoji}</div>
                <h2 className="text-3xl font-bold mb-4 leading-relaxed">
                  {message.message}
                </h2>
                <div className="flex justify-center gap-2 mt-8">
                  <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                    핵심 키워드: {message.keyword}
                  </span>
                </div>
              </div>
            </div>

            {/* 상세 조언 카드 */}
            <div className="card bg-white border-2 border-purple-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">💡</div>
                <h3 className="text-2xl font-bold text-gray-800">오늘의 조언</h3>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {message.advice}
              </p>
            </div>

            {/* 영감 섹션 */}
            <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✨ 오늘의 다짐</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">→</span>
                  <span>오늘 하루를 최선을 다해 살아가겠습니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">→</span>
                  <span>긍정적인 마음으로 모든 일에 임하겠습니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">→</span>
                  <span>주변 사람들에게 감사함을 표현하겠습니다.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 font-bold">→</span>
                  <span>어려움 속에서도 희망을 잃지 않겠습니다.</span>
                </li>
              </ul>
            </div>

            {/* 새로고침 버튼 */}
            <div className="text-center">
              <button
                onClick={fetchDailyMessage}
                className="btn-primary"
              >
                다시 보기
              </button>
            </div>

            {/* 푸터 */}
            <div className="text-center mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                💫 매일 새로운 메시지가 당신을 기다리고 있습니다.<br />
                같은 날에는 같은 메시지가 표시됩니다.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DailyMessagePage;
