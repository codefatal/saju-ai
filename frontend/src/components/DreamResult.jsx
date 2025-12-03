import React from 'react';
import { FaMoon, FaStar, FaBrain, FaBook, FaCrystalBall, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';

const DreamResult = ({ result }) => {
  const getCategoryIcon = (category) => {
    const icons = {
      PERSON: '👤',
      ANIMAL: '🐾',
      NATURE: '🌳',
      OBJECT: '📦',
      ACTION: '🏃',
      EMOTION: '❤️',
      OTHER: '✨',
    };
    return icons[category] || '✨';
  };

  const getSignificanceColor = (significance) => {
    const colors = {
      HIGH: 'bg-red-100 text-red-700 border-red-300',
      MEDIUM: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      LOW: 'bg-green-100 text-green-700 border-green-300',
    };
    return colors[significance] || colors.MEDIUM;
  };

  const getSignificanceLabel = (significance) => {
    const labels = {
      HIGH: '매우 중요',
      MEDIUM: '중요',
      LOW: '참고',
    };
    return labels[significance] || '중요';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl shadow-2xl p-6 border border-indigo-500/30">
        <div className="flex items-start gap-4">
          <div className="text-5xl">{getCategoryIcon(result.category)}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.name ? `${result.name}님의 꿈 해몽` : '꿈 해몽 결과'}
            </h2>
            <div className="bg-white/10 rounded-lg p-3 border border-indigo-400/30">
              <p className="text-indigo-100 leading-relaxed">{result.dreamContent}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Overall Meaning */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-4">
          <FaMoon className="text-3xl text-indigo-600" />
          <h3 className="text-2xl font-bold text-gray-900">전체적인 의미</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {result.overallMeaning}
        </p>
      </div>

      {/* Psychological & Traditional Meanings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-6 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <FaBrain className="text-3xl text-blue-600" />
            <h3 className="text-xl font-bold text-blue-900">심리학적 해석</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.psychologicalMeaning}
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-3 mb-4">
            <FaBook className="text-3xl text-purple-600" />
            <h3 className="text-xl font-bold text-purple-900">전통 해몽</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.traditionalMeaning}
          </p>
        </div>
      </div>

      {/* Future Prediction */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg p-6 border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <FaCrystalBall className="text-3xl text-amber-600" />
          <h3 className="text-2xl font-bold text-amber-900">미래 예측 및 암시</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {result.futurePrediction}
        </p>
      </div>

      {/* Dream Symbols */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-indigo-200">
        <div className="flex items-center gap-3 mb-6">
          <FaStar className="text-3xl text-indigo-600" />
          <h3 className="text-2xl font-bold text-gray-900">꿈 속 주요 상징</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {result.symbols.map((symbol, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border-2 border-indigo-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-indigo-900 text-lg">{symbol.symbol}</h4>
                <span className={`text-xs px-2 py-1 rounded-full border ${getSignificanceColor(symbol.significance)}`}>
                  {getSignificanceLabel(symbol.significance)}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{symbol.meaning}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lucky Number */}
      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl shadow-lg p-6 border-2 border-yellow-300">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">🎲</div>
          <h3 className="text-xl font-bold text-amber-900">행운의 번호</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {result.luckyNumber.split(',').map((number, index) => (
            <div
              key={index}
              className="bg-yellow-300 text-yellow-900 font-bold text-2xl px-6 py-3 rounded-full shadow-md"
            >
              {number.trim()}
            </div>
          ))}
        </div>
      </div>

      {/* Advice & Warning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <FaLightbulb className="text-3xl text-green-600" />
            <h3 className="text-xl font-bold text-green-900">조언</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.advice}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <FaExclamationTriangle className="text-3xl text-orange-600" />
            <h3 className="text-xl font-bold text-orange-900">주의사항</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.warning}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
        <p className="text-sm text-indigo-700 text-center">
          🌙 꿈 해몽은 참고용입니다. 꿈은 개인의 무의식과 경험이 반영된 것이므로, 자신의 상황에 맞게 해석하세요.
        </p>
      </div>
    </div>
  );
};

export default DreamResult;
