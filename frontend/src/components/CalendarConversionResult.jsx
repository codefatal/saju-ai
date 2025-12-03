import { useState } from 'react';
import { FaArrowRight, FaCalendarAlt, FaYinYang, FaStar, FaRedo, FaShare } from 'react-icons/fa';
import { shareResult } from '../utils/shareUtils';

const CalendarConversionResult = ({ result, onNewConversion }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  if (!result) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 변환 결과 헤더 */}
      <div className="card text-center">
        <h2 className="text-3xl font-bold text-gradient mb-6">
          날짜 변환 완료
        </h2>

        {/* 변환 전후 비교 */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          {/* 입력 날짜 */}
          <div className="flex-1 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <FaCalendarAlt className="text-2xl text-blue-500" />
              <h3 className="text-lg font-bold text-gray-700">입력</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600 mb-2">
              {result.inputDateString}
            </p>
            {result.inputIsLeapMonth && (
              <span className="inline-flex items-center space-x-1 text-sm text-purple-600">
                <FaStar />
                <span>윤달</span>
              </span>
            )}
          </div>

          {/* 화살표 */}
          <FaArrowRight className="text-3xl text-primary-500 hidden md:block" />
          <div className="md:hidden">
            <FaArrowRight className="text-3xl text-primary-500 transform rotate-90" />
          </div>

          {/* 변환 날짜 */}
          <div className="flex-1 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <FaYinYang className="text-2xl text-purple-500" />
              <h3 className="text-lg font-bold text-gray-700">변환</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-2">
              {result.convertedDateString}
            </p>
            {result.convertedIsLeapMonth && (
              <span className="inline-flex items-center space-x-1 text-sm text-purple-600">
                <FaStar />
                <span>윤달</span>
              </span>
            )}
          </div>
        </div>

        {/* 요일 정보 */}
        <div className="inline-block px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full">
          <span className="text-lg font-medium text-gray-700">
            {result.weekDay}
          </span>
        </div>
      </div>

      {/* 간지 정보 */}
      <div className="card bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center mb-4">
          <FaYinYang className="text-4xl text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-800">간지 정보</h3>
        </div>
        <div className="text-center">
          <p className="text-xl md:text-2xl text-gray-700 font-medium leading-relaxed">
            {result.ganzi}
          </p>
        </div>
      </div>

      {/* 상세 정보 */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4">상세 정보</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 입력 정보 */}
          <div className="space-y-3">
            <h4 className="font-bold text-blue-600 mb-3">입력 날짜</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">연도:</span> {result.inputYear}년
              </p>
              <p>
                <span className="font-medium">월:</span> {result.inputMonth}월
              </p>
              <p>
                <span className="font-medium">일:</span> {result.inputDay}일
              </p>
              <p>
                <span className="font-medium">음력/양력:</span>{' '}
                {result.inputIsLunar ? '음력' : '양력'}
              </p>
            </div>
          </div>

          {/* 변환 정보 */}
          <div className="space-y-3">
            <h4 className="font-bold text-purple-600 mb-3">변환된 날짜</h4>
            <div className="space-y-2 text-gray-700">
              <p>
                <span className="font-medium">연도:</span> {result.convertedYear}년
              </p>
              <p>
                <span className="font-medium">월:</span> {result.convertedMonth}월
              </p>
              <p>
                <span className="font-medium">일:</span> {result.convertedDay}일
              </p>
              <p>
                <span className="font-medium">음력/양력:</span>{' '}
                {result.convertedIsLunar ? '음력' : '양력'}
              </p>
            </div>
          </div>
        </div>
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
                  const shareText = `${result.inputDateString} = ${result.convertedDateString} (${result.ganzi}) - 모두의사주AI`;
                  shareResult('음양력변환', shareText, window.location.href);
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
        <button onClick={onNewConversion} className="btn-secondary inline-flex items-center space-x-2">
          <FaRedo />
          <span>다른 날짜 변환하기</span>
        </button>
      </div>
    </div>
  );
};

export default CalendarConversionResult;
