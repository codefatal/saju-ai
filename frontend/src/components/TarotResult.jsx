import React, { useState } from 'react';
import { FaStar, FaMoon, FaSun, FaHeart, FaBriefcase, FaDollarSign, FaHeartbeat } from 'react-icons/fa';

const TarotResult = ({ result }) => {
  const [flippedCards, setFlippedCards] = useState([false, false, false]);

  const getCategoryIcon = (category) => {
    const icons = {
      LOVE: <FaHeart className="text-pink-400" />,
      CAREER: <FaBriefcase className="text-blue-400" />,
      MONEY: <FaDollarSign className="text-yellow-400" />,
      HEALTH: <FaHeartbeat className="text-red-400" />,
      GENERAL: <FaStar className="text-purple-400" />,
    };
    return icons[category] || icons.GENERAL;
  };

  const getPositionInfo = (position) => {
    const positions = {
      PAST: { label: '과거', icon: <FaMoon />, color: 'text-blue-400', bgColor: 'bg-blue-500/20' },
      PRESENT: { label: '현재', icon: <FaSun />, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' },
      FUTURE: { label: '미래', icon: <FaStar />, color: 'text-purple-400', bgColor: 'bg-purple-500/20' },
    };
    return positions[position] || positions.PRESENT;
  };

  const handleCardClick = (index) => {
    setFlippedCards(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl p-6 border border-purple-500/30">
        <div className="flex items-start gap-4">
          <div className="text-4xl">{getCategoryIcon(result.category)}</div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">
              {result.name ? `${result.name}님의 타로 리딩` : '타로 리딩 결과'}
            </h2>
            <p className="text-purple-200 text-lg italic">"{result.question}"</p>
          </div>
        </div>
      </div>

      {/* Three Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {result.cards.map((card, index) => {
          const positionInfo = getPositionInfo(card.position);
          const isFlipped = flippedCards[index];

          return (
            <div key={index} className="perspective">
              <div
                className={`card-container ${isFlipped ? 'flipped' : ''}`}
                onClick={() => handleCardClick(index)}
                style={{ cursor: 'pointer' }}
              >
                {/* Card Back */}
                <div className="card-face card-back bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl shadow-xl p-6 border-2 border-purple-400">
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4">🔮</div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${positionInfo.bgColor}`}>
                      <span className={positionInfo.color}>{positionInfo.icon}</span>
                      <span className="text-white font-bold">{positionInfo.label}</span>
                    </div>
                    <p className="text-purple-200 text-sm mt-4">클릭하여 펼치기</p>
                  </div>
                </div>

                {/* Card Front */}
                <div className="card-face card-front bg-white rounded-xl shadow-xl overflow-hidden">
                  <div className={`p-4 ${positionInfo.bgColor} border-b-2 border-purple-200`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`inline-flex items-center gap-2 ${positionInfo.color}`}>
                        {positionInfo.icon}
                        <span className="font-bold text-gray-800">{positionInfo.label}</span>
                      </div>
                      {card.isReversed && (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                          역방향
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{card.nameKorean}</h3>
                    <p className="text-sm text-gray-600 italic">{card.name}</p>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-semibold text-purple-600 mb-1">카드 의미</h4>
                      <p className="text-sm text-gray-700">{card.meaning}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-purple-600 mb-1">상황 해석</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{card.interpretation}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-purple-600 mb-1">핵심 키워드</h4>
                      <div className="flex flex-wrap gap-2">
                        {card.keyword.split(',').map((keyword, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {keyword.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Reading */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <FaStar className="text-3xl text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-900">종합 해석</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
          {result.overallReading}
        </p>
      </div>

      {/* Advice & Warning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-lg p-6 border-2 border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">💡</div>
            <h3 className="text-xl font-bold text-green-900">조언</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.advice}
          </p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="text-3xl">⚠️</div>
            <h3 className="text-xl font-bold text-orange-900">주의사항</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {result.warning}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
        <p className="text-sm text-purple-700 text-center">
          🌙 타로 카드는 여러분의 선택을 돕는 도구입니다. 최종 결정은 항상 여러분의 자유 의지에 달려 있습니다.
        </p>
      </div>

      <style>{`
        .perspective {
          perspective: 1000px;
        }

        .card-container {
          position: relative;
          width: 100%;
          height: 500px;
          transition: transform 0.6s;
          transform-style: preserve-3d;
        }

        .card-container.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
        }

        .card-back {
          transform: rotateY(0deg);
        }

        .card-front {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default TarotResult;
