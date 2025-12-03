import { useState } from 'react';
import { FaHeart, FaRing, FaBriefcase, FaUsers, FaStar, FaLightbulb, FaExclamationTriangle, FaRedo, FaShare } from 'react-icons/fa';
import { shareResult } from '../utils/shareUtils';

const CompatibilityResult = ({ result, onNewAnalysis }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!result) return null;

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

  const getGradeEmoji = (grade) => {
    if (grade === '최상') return '💖';
    if (grade === '상') return '😊';
    if (grade === '중') return '😌';
    return '😐';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-gradient mb-6">
          궁합 분석 결과
        </h2>

        {/* 두 사람 정보 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <h3 className="text-xl font-bold text-blue-700 mb-3">{result.person1Name}</h3>
            <p className="text-gray-700 font-medium">{result.person1Saju}</p>
          </div>

          <FaHeart className="text-4xl text-pink-500" />

          <div className="flex-1 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <h3 className="text-xl font-bold text-purple-700 mb-3">{result.person2Name}</h3>
            <p className="text-gray-700 font-medium">{result.person2Saju}</p>
          </div>
        </div>

        {/* 전체 궁합 점수 */}
        <div className={`inline-block bg-gradient-to-r ${getScoreGradient(result.overallScore)} rounded-full p-8 mb-4`}>
          <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center">
            <div>
              <div className={`text-6xl font-bold ${getScoreColor(result.overallScore)}`}>
                {result.overallScore}
              </div>
              <div className="text-sm text-gray-600">점</div>
            </div>
          </div>
        </div>

        <div className="text-2xl font-bold text-gray-700 mb-2">
          {getGradeEmoji(result.compatibilityGrade)} {result.compatibilityGrade} 궁합
        </div>
      </div>

      {/* 전반적인 궁합 */}
      <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="flex items-center space-x-3 mb-4">
          <FaStar className="text-3xl text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-800">전반적인 궁합</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {result.overallCompatibility}
        </p>
      </div>

      {/* 세부 궁합 점수 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 애정 궁합 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <FaHeart className="text-2xl text-red-500" />
            <h3 className="text-xl font-bold text-gray-800">애정 궁합</h3>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(result.loveScore)}`}>
                {result.loveScore}점
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(result.loveScore)}`}
                style={{ width: `${result.loveScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.loveCompatibility}
          </p>
        </div>

        {/* 결혼 궁합 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <FaRing className="text-2xl text-pink-500" />
            <h3 className="text-xl font-bold text-gray-800">결혼 궁합</h3>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(result.marriageScore)}`}>
                {result.marriageScore}점
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(result.marriageScore)}`}
                style={{ width: `${result.marriageScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.marriageCompatibility}
          </p>
        </div>

        {/* 사업 궁합 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <FaBriefcase className="text-2xl text-blue-500" />
            <h3 className="text-xl font-bold text-gray-800">사업 궁합</h3>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(result.businessScore)}`}>
                {result.businessScore}점
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(result.businessScore)}`}
                style={{ width: `${result.businessScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.businessCompatibility}
          </p>
        </div>

        {/* 우정 궁합 */}
        <div className="card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <FaUsers className="text-2xl text-green-500" />
            <h3 className="text-xl font-bold text-gray-800">우정 궁합</h3>
          </div>
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className={`text-3xl font-bold ${getScoreColor(result.friendshipScore)}`}>
                {result.friendshipScore}점
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(result.friendshipScore)}`}
                style={{ width: `${result.friendshipScore}%` }}
              ></div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.friendshipCompatibility}
          </p>
        </div>
      </div>

      {/* 강점과 약점 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 강점 */}
        <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="flex items-center space-x-3 mb-4">
            <FaStar className="text-3xl text-green-600" />
            <h3 className="text-2xl font-bold text-gray-800">강점</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {result.strengths}
          </p>
        </div>

        {/* 약점 */}
        <div className="card bg-gradient-to-br from-orange-50 to-red-50">
          <div className="flex items-center space-x-3 mb-4">
            <FaExclamationTriangle className="text-3xl text-orange-600" />
            <h3 className="text-2xl font-bold text-gray-800">주의할 점</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
            {result.weaknesses}
          </p>
        </div>
      </div>

      {/* 조언 */}
      <div className="card bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="flex items-center space-x-3 mb-4">
          <FaLightbulb className="text-3xl text-amber-500" />
          <h3 className="text-2xl font-bold text-gray-800">조언</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {result.advice}
        </p>
      </div>

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
                  const shareText = `${result.person1Name}과 ${result.person2Name}의 궁합 점수 ${result.overallScore}점! - 모두의사주AI`;
                  shareResult('궁합 분석', shareText, window.location.href);
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
        <button onClick={onNewAnalysis} className="btn-secondary inline-flex items-center space-x-2">
          <FaRedo />
          <span>다른 궁합 보기</span>
        </button>
      </div>
    </div>
  );
};

export default CompatibilityResult;
