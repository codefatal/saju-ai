import { useState } from 'react';
import { FaStar, FaHeart, FaMoneyBill, FaBriefcase, FaHeartbeat, FaPalette, FaDice, FaCompass, FaExclamationTriangle, FaLightbulb, FaShare } from 'react-icons/fa';
import { shareResult } from '../utils/shareUtils';

const ZodiacFortuneResult = ({ fortune, onNewFortune }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!fortune) return null;

  const { zodiacName, zodiacCharacter, date, overallFortune, loveFortune, moneyFortune, workFortune, healthFortune,
    loveScore, moneyScore, workScore, healthScore, overallScore, luckyColor, luckyNumber, luckyDirection, caution, advice } = fortune;

  // 점수에 따른 색상
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBarColor = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // 띠 이모지
  const zodiacEmojis = {
    '쥐': '🐭', '소': '🐮', '호랑이': '🐯', '토끼': '🐰',
    '용': '🐲', '뱀': '🐍', '말': '🐴', '양': '🐑',
    '원숭이': '🐵', '닭': '🐔', '개': '🐶', '돼지': '🐷'
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="card text-center">
        <div className="text-7xl mb-4">{zodiacEmojis[zodiacName]}</div>
        <h2 className="text-3xl font-bold text-gradient mb-2">
          {zodiacName}띠 ({zodiacCharacter}) 운세
        </h2>
        <p className="text-gray-600">{date}</p>
      </div>

      {/* 종합 운세 점수 */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">종합 운세</h3>
          <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}점
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div
            className={`h-4 rounded-full ${getScoreBarColor(overallScore)} transition-all duration-1000`}
            style={{ width: `${overallScore}%` }}
          ></div>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {overallFortune}
        </p>
      </div>

      {/* 세부 운세 점수 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 애정운 */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaHeart className="text-2xl text-red-500" />
              <h3 className="text-xl font-bold text-gray-800">애정운</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(loveScore)}`}>
              {loveScore}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${getScoreBarColor(loveScore)}`}
              style={{ width: `${loveScore}%` }}
            ></div>
          </div>
          <p className="text-gray-700 text-sm">{loveFortune}</p>
        </div>

        {/* 재물운 */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaMoneyBill className="text-2xl text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">재물운</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(moneyScore)}`}>
              {moneyScore}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${getScoreBarColor(moneyScore)}`}
              style={{ width: `${moneyScore}%` }}
            ></div>
          </div>
          <p className="text-gray-700 text-sm">{moneyFortune}</p>
        </div>

        {/* 직업운 */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaBriefcase className="text-2xl text-blue-500" />
              <h3 className="text-xl font-bold text-gray-800">직업운</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(workScore)}`}>
              {workScore}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${getScoreBarColor(workScore)}`}
              style={{ width: `${workScore}%` }}
            ></div>
          </div>
          <p className="text-gray-700 text-sm">{workFortune}</p>
        </div>

        {/* 건강운 */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <FaHeartbeat className="text-2xl text-pink-500" />
              <h3 className="text-xl font-bold text-gray-800">건강운</h3>
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(healthScore)}`}>
              {healthScore}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
            <div
              className={`h-2 rounded-full ${getScoreBarColor(healthScore)}`}
              style={{ width: `${healthScore}%` }}
            ></div>
          </div>
          <p className="text-gray-700 text-sm">{healthFortune}</p>
        </div>
      </div>

      {/* 행운 요소 */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">오늘의 행운 키워드</h3>
        <div className="grid md:grid-cols-3 gap-6 justify-items-center">
          {/* 행운의 색상 */}
          <div className="text-center">
            <FaPalette className="text-3xl text-primary-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 색상</h4>
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg">
              {luckyColor}
            </div>
          </div>

          {/* 행운의 숫자 */}
          <div className="text-center">
            <FaDice className="text-3xl text-secondary-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 숫자</h4>
            <div className="inline-block w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {luckyNumber}
            </div>
          </div>

          {/* 행운의 방향 */}
          <div className="text-center">
            <FaCompass className="text-3xl text-green-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 방향</h4>
            <div className="text-2xl font-bold text-green-600">
              {luckyDirection}
            </div>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      {caution && (
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3 mb-3">
            <FaExclamationTriangle className="text-2xl text-yellow-600" />
            <h3 className="text-xl font-bold text-gray-800">오늘 주의할 점</h3>
          </div>
          <p className="text-gray-700">{caution}</p>
        </div>
      )}

      {/* 오늘의 조언 */}
      {advice && (
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center space-x-3 mb-3">
            <FaLightbulb className="text-2xl text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">오늘의 조언</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{advice}</p>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex justify-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="btn-primary flex items-center justify-center space-x-2"
          >
            <FaShare />
            <span>공유</span>
          </button>
          {showShareMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  const shareText = `${zodiacName}띠 (${zodiacCharacter})의 오늘 운세 - ${date} - 모두의사주AI`;
                  shareResult('띠별운세', shareText, window.location.href);
                  setShowShareMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
              >
                <FaShare className="text-blue-500" />
                <span>일반 공유</span>
              </button>
            </div>
          )}
        </div>
        <button onClick={onNewFortune} className="btn-secondary">
          다른 띠 보기
        </button>
      </div>
    </div>
  );
};

export default ZodiacFortuneResult;
