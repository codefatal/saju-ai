import React from 'react';
import { FaCalendarCheck, FaStar, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const LuckyDayResult = ({ result }) => {
  const getRatingColor = (rating) => {
    const colors = {
      EXCELLENT: 'from-yellow-400 to-orange-400',
      GOOD: 'from-green-400 to-emerald-400',
      FAIR: 'from-blue-400 to-cyan-400',
    };
    return colors[rating] || colors.FAIR;
  };

  const getRatingLabel = (rating) => {
    const labels = { EXCELLENT: '최상', GOOD: '좋음', FAIR: '보통' };
    return labels[rating] || '보통';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 rounded-2xl shadow-2xl p-6 border border-green-500/30">
        <h2 className="text-2xl font-bold text-white mb-2">길일 추천 결과</h2>
        <p className="text-green-200">{result.startDate} ~ {result.endDate}</p>
      </div>

      {/* Lucky Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.luckyDays.map((day, index) => (
          <div key={index} className={`bg-gradient-to-br ${getRatingColor(day.rating)} rounded-xl shadow-lg p-6 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold">{day.date}</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                {getRatingLabel(day.rating)}
              </div>
            </div>
            <p className="text-white/90 mb-2">{day.dayOfWeek}</p>
            <p className="text-sm text-white/80 mb-3">{day.lunarDate} ({day.ganzi})</p>
            <div className="bg-white/10 rounded-lg p-3 mb-3">
              <p className="text-sm leading-relaxed">{day.reason}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-bold flex items-center gap-2">
                  <FaCheckCircle /> 적합한 일
                </p>
                <p className="text-white/90 ml-5">{day.goodFor.join(', ')}</p>
              </div>
              <div>
                <p className="font-bold flex items-center gap-2">
                  <FaTimesCircle /> 피해야 할 일
                </p>
                <p className="text-white/90 ml-5">{day.avoidFor.join(', ')}</p>
              </div>
              <div className="bg-white/10 rounded p-2 mt-2">
                <p className="text-xs">⏰ {day.timeRecommendation}</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <div className="text-3xl font-bold">{day.score}점</div>
            </div>
          </div>
        ))}
      </div>

      {/* Avoid Days */}
      {result.avoidDays && result.avoidDays.length > 0 && (
        <div className="bg-red-50 rounded-xl shadow-lg p-6 border-2 border-red-200">
          <h3 className="text-xl font-bold text-red-900 mb-3 flex items-center gap-2">
            <FaTimesCircle /> 피해야 할 날
          </h3>
          <div className="flex flex-wrap gap-2">
            {result.avoidDays.map((date, index) => (
              <span key={index} className="bg-red-200 text-red-900 px-3 py-1 rounded-full text-sm font-medium">
                {date}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Overall Advice */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-green-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaStar className="text-green-600" /> 종합 조언
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">{result.overallAdvice}</p>
        <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-900">
            <strong>⏰ 최적 시간대:</strong> {result.bestTimeOfDay}
          </p>
        </div>
      </div>

      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
        <p className="text-sm text-green-700 text-center">
          📅 길일은 참고용입니다. 최종 결정은 본인의 상황에 맞게 하시기 바랍니다.
        </p>
      </div>
    </div>
  );
};

export default LuckyDayResult;
