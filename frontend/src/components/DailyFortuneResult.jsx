import { useState } from 'react';
import { FaStar, FaHeart, FaMoneyBill, FaBriefcase, FaHeartbeat, FaPalette, FaDice, FaCompass, FaClock, FaLightbulb, FaShare } from 'react-icons/fa';
import { shareResult } from '../utils/shareUtils';

const DailyFortuneResult = ({ fortune, onNewFortune }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!fortune) return null;

  const { year, month, day, hour, minute, gender, isLunar, fortuneDate } = fortune;
  const calendar = isLunar ? '음력' : '양력';
  const genderText = gender === 'MALE' ? '남성' : '여성';

  // 운세 점수에 따른 색상
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreGradient = (score) => {
    if (score >= 80) return 'from-green-500 to-emerald-500';
    if (score >= 60) return 'from-blue-500 to-cyan-500';
    if (score >= 40) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="card">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gradient mb-2">
            {fortuneDate} 오늘의 운세
          </h2>
          <p className="text-gray-600">
            {calendar} {year}년 {month}월 {day}일 {hour}시 {minute}분 ({genderText})
          </p>
        </div>

        {/* 운세 점수 */}
        <div className="text-center">
          <div className={`inline-block bg-gradient-to-r ${getScoreGradient(fortune.fortuneScore)} rounded-full p-8 mb-4`}>
            <div className="bg-white rounded-full w-32 h-32 flex items-center justify-center">
              <div>
                <div className={`text-5xl font-bold ${getScoreColor(fortune.fortuneScore)}`}>
                  {fortune.fortuneScore}
                </div>
                <div className="text-sm text-gray-600">점</div>
              </div>
            </div>
          </div>
          <p className="text-lg font-medium text-gray-700">
            {fortune.fortuneScore >= 80 && '🌟 매우 좋은 하루가 될 것입니다!'}
            {fortune.fortuneScore >= 60 && fortune.fortuneScore < 80 && '😊 좋은 일이 기다리고 있어요'}
            {fortune.fortuneScore >= 40 && fortune.fortuneScore < 60 && '😌 평범하지만 괜찮은 하루'}
            {fortune.fortuneScore < 40 && '💪 조심스럽게 하루를 시작하세요'}
          </p>
        </div>
      </div>

      {/* 전반적인 운세 */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center space-x-3 mb-4">
          <FaStar className="text-3xl text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-800">전반적인 운세</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {fortune.overallFortune}
        </p>
      </div>

      {/* 세부 운세 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 애정운 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <FaHeart className="text-2xl text-red-500" />
            <h3 className="text-xl font-bold text-gray-800">애정운</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {fortune.loveFortune}
          </p>
        </div>

        {/* 재물운 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <FaMoneyBill className="text-2xl text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">재물운</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {fortune.moneyFortune}
          </p>
        </div>

        {/* 직업운 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <FaBriefcase className="text-2xl text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">직업운</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {fortune.workFortune}
          </p>
        </div>

        {/* 건강운 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-3">
            <FaHeartbeat className="text-2xl text-pink-500" />
            <h3 className="text-xl font-bold text-gray-800">건강운</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {fortune.healthFortune}
          </p>
        </div>
      </div>

      {/* 행운 요소 */}
      <div className="card">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">오늘의 행운 아이템</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 행운의 색상 */}
          <div className="text-center">
            <FaPalette className="text-3xl text-primary-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 색상</h4>
            <div className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg">
              {fortune.luckyColor}
            </div>
          </div>

          {/* 행운의 숫자 */}
          <div className="text-center">
            <FaDice className="text-3xl text-secondary-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 숫자</h4>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {fortune.luckyNumber}
              </div>
            </div>
          </div>

          {/* 행운의 방향 */}
          <div className="text-center">
            <FaCompass className="text-3xl text-green-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 방향</h4>
            <div className="text-xl font-medium text-green-600">
              {fortune.luckyDirection}
            </div>
          </div>

          {/* 행운의 시간 */}
          <div className="text-center">
            <FaClock className="text-3xl text-blue-500 mx-auto mb-3" />
            <h4 className="font-bold text-gray-700 mb-2">행운의 시간대</h4>
            <div className="text-xl font-medium text-blue-600">
              {fortune.luckyTime}
            </div>
          </div>
        </div>
      </div>

      {/* 오늘의 조언 */}
      <div className="card bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="flex items-center space-x-3 mb-4">
          <FaLightbulb className="text-3xl text-amber-500" />
          <h3 className="text-2xl font-bold text-gray-800">오늘의 조언</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {fortune.advice}
        </p>
      </div>

      {/* 다시 보기 버튼 */}
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
                  const shareText = `${fortuneDate}의 오늘의 운세를 확인해보세요! - 모두의사주AI`;
                  shareResult('오늘의 운세', shareText, window.location.href);
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
          다른 날짜로 보기
        </button>
      </div>
    </div>
  );
};

export default DailyFortuneResult;
