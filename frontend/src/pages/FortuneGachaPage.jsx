import { useState } from 'react';
import { drawFortune } from '../api/sajuApi';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';

function FortuneGachaPage() {
  const [fortune, setFortune] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleDrawFortune = async () => {
    try {
      setIsSpinning(true);
      setError(null);

      // 스핀 애니메이션 시간 (1초)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsLoading(true);
      const data = await drawFortune();
      setFortune(data);
    } catch (err) {
      setError(err.message || '운세를 뽑을 수 없습니다.');
      console.error('운세 뽑기 실패:', err);
    } finally {
      setIsLoading(false);
      setIsSpinning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 제목 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gradient mb-2">운세 뽑기</h1>
          <p className="text-gray-600">🎰 행운의 룰렛을 돌려 오늘의 운세를 확인하세요</p>
        </div>

        {/* 룰렛 카드 */}
        <div className="card shadow-2xl mb-8">
          <div className={`bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 rounded-lg p-12 text-center text-white transition-transform duration-1000 ${isSpinning ? 'scale-105 rotate-360' : 'scale-100'}`}
            style={{
              animation: isSpinning ? 'spin 1s linear' : 'none',
              minHeight: '300px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            {fortune ? (
              <>
                <div className="text-7xl mb-4">{fortune.emoji}</div>
                <h2 className="text-4xl font-bold mb-4">{fortune.title}</h2>
                <div className="text-xl font-medium mb-6 max-w-md mx-auto">
                  {fortune.fortune}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-5xl font-bold">{fortune.score}</div>
                  <div className="text-lg">점</div>
                </div>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">🎲</div>
                <p className="text-2xl font-bold">운세를 뽑아보세요!</p>
              </>
            )}
          </div>
        </div>

        {/* 상세 정보 */}
        {fortune && (
          <div className="space-y-6 animate-fade-in">
            {/* 점수 바 */}
            <div className="card">
              <h3 className="text-lg font-bold text-gray-800 mb-3">운세 점수</h3>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${fortune.color} transition-all duration-1000`}
                  style={{ width: `${fortune.score}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">{fortune.score}점</p>
            </div>

            {/* 조언 */}
            <div className="card bg-blue-50 border-2 border-blue-200">
              <div className="flex items-start gap-3">
                <span className="text-3xl">💡</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">조언</h3>
                  <p className="text-gray-700 leading-relaxed">{fortune.advice}</p>
                </div>
              </div>
            </div>

            {/* 운세 등급 설명 */}
            <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">운세 등급</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="font-bold text-red-500">대길</span>: 최고의 운</div>
                <div><span className="font-bold text-orange-500">길</span>: 좋은 운</div>
                <div><span className="font-bold text-yellow-500">중길</span>: 중간 이상</div>
                <div><span className="font-bold text-gray-600">평길</span>: 평온한 운</div>
                <div><span className="font-bold text-blue-500">소길</span>: 조금 나은 운</div>
                <div><span className="font-bold text-purple-600">길흉</span>: 길흉 섞임</div>
                <div><span className="font-bold text-red-600">흉</span>: 안 좋은 운</div>
                <div><span className="font-bold text-red-700">대흉</span>: 최악의 운</div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <ErrorMessage message={error} onRetry={handleDrawFortune} />
        )}

        {isLoading && <Loading />}

        {/* 버튼 */}
        <div className="text-center mt-12">
          <button
            onClick={handleDrawFortune}
            disabled={isSpinning || isLoading}
            className={`px-12 py-4 rounded-full font-bold text-white text-lg transition-all ${
              isSpinning || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:shadow-lg hover:scale-105'
            }`}
          >
            {isSpinning ? '뽑는 중...' : isLoading ? '결과 로딩 중...' : '🎰 운세 뽑기'}
          </button>
        </div>

        {/* 푸터 */}
        <div className="text-center mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-500">
            ✨ 매일 새로운 운세를 만나보세요!<br />
            수천 가지의 운세 조합 중 당신의 운명을 찾아보세요.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotateZ(0deg);
          }
          to {
            transform: rotateZ(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export default FortuneGachaPage;
