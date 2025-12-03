import React from 'react';
import { FaBook, FaStar, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const TojeongResult = ({ result }) => {
  const getRatingColor = (rating) => {
    const colors = {
      EXCELLENT: 'from-yellow-400 to-orange-400',
      GOOD: 'from-green-400 to-emerald-400',
      FAIR: 'from-blue-400 to-cyan-400',
      POOR: 'from-gray-400 to-slate-400',
    };
    return colors[rating] || colors.FAIR;
  };

  const getRatingLabel = (rating) => {
    const labels = { EXCELLENT: '대길', GOOD: '길', FAIR: '보통', POOR: '흉' };
    return labels[rating] || '보통';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 rounded-2xl shadow-2xl p-6 border border-amber-500/30">
        <h2 className="text-3xl font-bold text-white mb-2">{result.year}년 토정비결</h2>
        <p className="text-amber-200">생년월일: {result.birthYear}년 {result.birthMonth}월 {result.birthDay}일</p>
        <div className="mt-4 flex items-center gap-4">
          <div className="bg-white/10 rounded-lg px-4 py-2">
            <span className="text-amber-200 text-sm">연운 점수</span>
            <span className="text-white text-2xl font-bold ml-2">{result.yearlyScore}점</span>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2">
            <span className="text-green-300 text-sm">최고의 달: </span>
            <span className="text-white font-bold">{result.bestMonth}</span>
          </div>
          <div className="bg-white/10 rounded-lg px-4 py-2">
            <span className="text-red-300 text-sm">주의할 달: </span>
            <span className="text-white font-bold">{result.worstMonth}</span>
          </div>
        </div>
      </div>

      {/* Yearly Overview */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-amber-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <FaBook className="text-amber-600" /> 연간 종합 운세
        </h3>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line mb-4">{result.yearlyOverview}</p>
        <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
          <h4 className="font-bold text-amber-900 mb-2">연간 조언</h4>
          <p className="text-gray-700 whitespace-pre-line">{result.yearlyAdvice}</p>
        </div>
      </div>

      {/* Monthly Fortunes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.monthlyFortunes.map((month) => (
          <div key={month.month} className={`bg-gradient-to-br ${getRatingColor(month.rating)} rounded-xl shadow-lg p-5 text-white`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-2xl font-bold">{month.monthName}</h3>
              <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-bold">
                {getRatingLabel(month.rating)}
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">{month.score}점</div>
            <div className="bg-white/10 rounded-lg p-3 mb-3 text-sm">
              <p className="font-bold mb-1">⭐ {month.luckyStar}</p>
              <p className="leading-relaxed">{month.overallFortune}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-bold flex items-center gap-1">
                  <FaCheckCircle /> 좋은 일
                </p>
                <ul className="ml-5 mt-1">
                  {month.goodThings.map((thing, idx) => (
                    <li key={idx} className="text-white/90">• {thing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-bold flex items-center gap-1">
                  <FaExclamationTriangle /> 주의할 일
                </p>
                <ul className="ml-5 mt-1">
                  {month.warningThings.map((thing, idx) => (
                    <li key={idx} className="text-white/90">• {thing}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/10 rounded p-2 mt-2">
                <p className="text-xs font-bold mb-1">조언</p>
                <p className="text-xs">{month.advice}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
        <p className="text-sm text-amber-700 text-center">
          📖 토정비결은 참고용입니다. 긍정적인 마음으로 한 해를 준비하세요.
        </p>
      </div>
    </div>
  );
};

export default TojeongResult;
