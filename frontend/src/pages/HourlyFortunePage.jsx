import { useState, useEffect } from 'react';
import { getHourlyFortune } from '../api/sajuApi';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function HourlyFortunePage() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHourlyFortune();
  }, []);

  const fetchHourlyFortune = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getHourlyFortune();
      setData(result);
    } catch (err) {
      setError(err.message || '시간대 운세를 불러올 수 없습니다.');
      console.error('시간대 운세 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-emerald-500';
    if (score >= 60) return 'from-blue-400 to-cyan-500';
    if (score >= 40) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-pink-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-2">⏰ 시간대 운세</h1>
          <p className="text-gray-600">오늘의 시간대별 운세를 확인하세요</p>
          {data && <p className="text-sm text-gray-500 mt-2">{data.date}</p>}
        </div>

        {error ? (
          <ErrorMessage message={error} onRetry={fetchHourlyFortune} />
        ) : data ? (
          <div className="space-y-6 animate-fade-in">
            {/* 시간대별 운세 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.hours.map((hour, index) => (
                <div
                  key={index}
                  className={`card bg-gradient-to-br ${getScoreColor(hour.score)} text-white shadow-lg hover:shadow-xl transition-shadow`}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{hour.koreanTime}</h3>
                        <p className="text-sm opacity-90">{hour.timeRange}</p>
                      </div>
                      {hour.isGoodTime && <span className="text-2xl">✨</span>}
                    </div>
                  </div>

                  {/* 점수 바 */}
                  <div className="mb-4">
                    <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-white transition-all duration-500"
                        style={{ width: `${hour.score}%` }}
                      />
                    </div>
                    <p className="text-sm mt-2 text-white/90">{hour.score}점</p>
                  </div>

                  {/* 설명 */}
                  <p className="text-sm leading-relaxed mb-3 text-white/95">
                    {hour.fortune}
                  </p>

                  {/* 조언 */}
                  <div className="bg-white/10 rounded p-3">
                    <p className="text-xs text-white/90">{hour.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* 범례 */}
            <div className="card bg-white border-2 border-indigo-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">⏰ 12시진</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
                {['자시', '축시', '인시', '묘시', '진시', '사시', '오시', '미시', '신시', '유시', '술시', '해시'].map((time, i) => (
                  <div key={i} className="text-center">
                    <div className="font-bold text-indigo-600">{time}</div>
                    <div className="text-xs text-gray-500">
                      {i < 6 ? `${i * 2}:00-${(i + 1) * 2}:00` : `${(i - 6) * 2 + 12}:00-${(i - 5) * 2 + 12}:00`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 팁 */}
            <div className="card bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">💡 팁</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✨ 마크가 표시된 시간대는 특히 길한 시간입니다.</li>
                <li>🔴 점수가 높을수록 운이 좋은 시간대입니다.</li>
                <li>각 시간대의 추천사항을 참고하여 계획을 세우세요.</li>
                <li>같은 날짜에는 같은 운세 결과가 표시됩니다.</li>
              </ul>
            </div>

            {/* 새로고침 버튼 */}
            <div className="text-center">
              <button
                onClick={fetchHourlyFortune}
                className="btn-primary"
              >
                새로고침
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default HourlyFortunePage;
