import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaEye } from 'react-icons/fa';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import SajuResult from '../components/SajuResult';
import useSajuStore from '../store/useSajuStore';

const HistoryPage = () => {
  const [selectedResult, setSelectedResult] = useState(null);
  const { history, isLoading, error, fetchHistory } = useSajuStore();

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleViewResult = (result) => {
    setSelectedResult(result);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedResult(null);
  };

  if (selectedResult) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <SajuResult result={selectedResult} onNewAnalysis={handleBack} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            분석 이력
          </h1>
          <p className="text-xl text-gray-600">
            최근 분석한 사주 결과를 확인하세요
          </p>
        </div>

        {isLoading ? (
          <Loading message="이력을 불러오는 중..." />
        ) : error ? (
          <ErrorMessage message={error} onRetry={fetchHistory} />
        ) : history.length === 0 ? (
          <div className="card text-center py-16">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              분석 이력이 없습니다
            </h3>
            <p className="text-gray-500 mb-8">
              첫 번째 사주 분석을 시작해보세요
            </p>
            <a href="/analysis" className="btn-primary inline-block">
              사주 분석하기
            </a>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((result) => (
              <div
                key={result.id}
                className="card hover:scale-105 transition-transform duration-300 cursor-pointer"
                onClick={() => handleViewResult(result)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    {result.isLunar ? '음력' : '양력'} {result.gender === 'MALE' ? '남성' : '여성'}
                  </h3>
                  <FaEye className="text-primary-500 text-xl" />
                </div>

                <div className="space-y-2 mb-4">
                  <p className="text-gray-600">
                    <FaCalendarAlt className="inline mr-2 text-primary-500" />
                    {result.year}년 {result.month}월 {result.day}일
                  </p>
                  <p className="text-sm text-gray-500">
                    {result.hour}시 {result.minute}분
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2 bg-purple-50 rounded text-center">
                    <p className="text-xs text-gray-600">년주</p>
                    <p className="text-sm font-bold text-purple-700 truncate">
                      {result.yearPillar?.split(' ')[0]}
                    </p>
                  </div>
                  <div className="p-2 bg-blue-50 rounded text-center">
                    <p className="text-xs text-gray-600">월주</p>
                    <p className="text-sm font-bold text-blue-700 truncate">
                      {result.monthPillar?.split(' ')[0]}
                    </p>
                  </div>
                  <div className="p-2 bg-green-50 rounded text-center">
                    <p className="text-xs text-gray-600">일주</p>
                    <p className="text-sm font-bold text-green-700 truncate">
                      {result.dayPillar?.split(' ')[0]}
                    </p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded text-center">
                    <p className="text-xs text-gray-600">시주</p>
                    <p className="text-sm font-bold text-amber-700 truncate">
                      {result.hourPillar?.split(' ')[0]}
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <span className="text-sm text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;
