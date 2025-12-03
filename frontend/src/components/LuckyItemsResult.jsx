import { useState } from 'react';
import { FaPalette, FaDice, FaUtensils, FaSpa, FaGift, FaMapMarkerAlt, FaExclamationTriangle, FaQuoteLeft, FaShare } from 'react-icons/fa';
import { shareResult } from '../utils/shareUtils';

const LuckyItemsResult = ({ items, onNewItems }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!items) return null;

  const { date, luckyColors, luckyNumbers, luckyFoods, luckyScent, luckyItems, luckyPlace, thingsToAvoid, dailyMessage } = items;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 헤더 */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-gradient mb-2">
          {date} 오늘의 럭키 아이템
        </h2>
        <p className="text-lg text-gray-600">행운을 가져다 줄 아이템들을 확인하세요!</p>
      </div>

      {/* 오늘의 한마디 */}
      {dailyMessage && (
        <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          <div className="flex items-start space-x-4">
            <FaQuoteLeft className="text-4xl opacity-50 flex-shrink-0 mt-2" />
            <p className="text-xl font-medium leading-relaxed">{dailyMessage}</p>
          </div>
        </div>
      )}

      {/* 행운의 색상 */}
      {luckyColors && luckyColors.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <FaPalette className="text-3xl text-primary-500" />
            <h3 className="text-2xl font-bold text-gray-800">행운의 색상</h3>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {luckyColors.map((color, index) => (
              <div
                key={index}
                className="px-6 py-3 rounded-full font-medium shadow-md bg-gradient-to-r from-primary-500 to-secondary-500 text-white"
              >
                {color}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            💡 이 색상들을 오늘 옷이나 소품으로 활용해보세요
          </p>
        </div>
      )}

      {/* 행운의 숫자 */}
      {luckyNumbers && luckyNumbers.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <FaDice className="text-3xl text-secondary-500" />
            <h3 className="text-2xl font-bold text-gray-800">행운의 숫자</h3>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {luckyNumbers.map((number, index) => (
              <div
                key={index}
                className="w-20 h-20 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg"
              >
                {number}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            💡 중요한 결정이나 선택을 할 때 이 숫자들을 떠올려보세요
          </p>
        </div>
      )}

      {/* 행운의 음식 & 향 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 행운의 음식 */}
        {luckyFoods && luckyFoods.length > 0 && (
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FaUtensils className="text-2xl text-green-500" />
              <h3 className="text-xl font-bold text-gray-800">행운의 음식</h3>
            </div>
            <ul className="space-y-2">
              {luckyFoods.map((food, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-green-500">🍀</span>
                  <span className="text-gray-700">{food}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              💡 오늘 식사나 간식으로 즐겨보세요
            </p>
          </div>
        )}

        {/* 행운의 향 */}
        {luckyScent && (
          <div className="card hover:scale-105 transition-transform duration-300">
            <div className="flex items-center space-x-3 mb-4">
              <FaSpa className="text-2xl text-purple-500" />
              <h3 className="text-xl font-bold text-gray-800">행운의 향</h3>
            </div>
            <div className="text-center py-4">
              <div className="inline-block px-6 py-3 bg-purple-100 rounded-lg">
                <span className="text-2xl font-medium text-purple-700">{luckyScent}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              💡 방향제, 향수, 디퓨저로 활용해보세요
            </p>
          </div>
        )}
      </div>

      {/* 행운의 아이템 */}
      {luckyItems && luckyItems.length > 0 && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <FaGift className="text-3xl text-pink-500" />
            <h3 className="text-2xl font-bold text-gray-800">행운의 아이템</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {luckyItems.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg text-center border-2 border-pink-200"
              >
                <span className="text-4xl mb-2 block">✨</span>
                <span className="text-lg font-medium text-gray-800">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600">
            💡 이 아이템들을 가까이 두거나 사용하면 행운이 따라옵니다
          </p>
        </div>
      )}

      {/* 행운의 장소 */}
      {luckyPlace && (
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50">
          <div className="flex items-center space-x-3 mb-4">
            <FaMapMarkerAlt className="text-3xl text-blue-500" />
            <h3 className="text-2xl font-bold text-gray-800">오늘 가볼 만한 곳</h3>
          </div>
          <div className="text-center py-4">
            <div className="inline-block px-8 py-4 bg-white rounded-lg shadow-md">
              <span className="text-2xl font-medium text-blue-700">{luckyPlace}</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            💡 오늘 이런 장소에 가면 좋은 일이 생길 수 있어요
          </p>
        </div>
      )}

      {/* 피해야 할 것들 */}
      {thingsToAvoid && thingsToAvoid.length > 0 && (
        <div className="card bg-red-50 border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <FaExclamationTriangle className="text-3xl text-red-500" />
            <h3 className="text-2xl font-bold text-gray-800">오늘은 이것을 주의하세요</h3>
          </div>
          <ul className="space-y-2">
            {thingsToAvoid.map((thing, index) => (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-red-500">⚠️</span>
                <span className="text-gray-700">{thing}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-600">
            💡 오늘은 이런 것들을 피하는 것이 좋습니다
          </p>
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
                  const shareText = `${date} 나의 럭키 아이템을 확인해보세요! - 모두의사주AI`;
                  shareResult('럭키 아이템', shareText, window.location.href);
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
        <button onClick={onNewItems} className="btn-secondary">
          다른 날짜로 보기
        </button>
      </div>
    </div>
  );
};

export default LuckyItemsResult;
