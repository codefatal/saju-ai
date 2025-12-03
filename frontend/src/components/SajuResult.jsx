import { FaUser, FaStar, FaBriefcase, FaHeart, FaHeartbeat, FaLightbulb, FaPalette, FaDice } from 'react-icons/fa';

const SajuResult = ({ result, onNewAnalysis }) => {
  if (!result) return null;

  const { year, month, day, hour, minute, gender, isLunar } = result;
  const calendar = isLunar ? '음력' : '양력';
  const genderText = gender === 'MALE' ? '남성' : '여성';

  const sections = [
    {
      icon: <FaUser className="text-primary-500" />,
      title: '성격 분석',
      content: result.personality,
      color: 'bg-purple-50',
    },
    {
      icon: <FaStar className="text-yellow-500" />,
      title: '전반적인 운세',
      content: result.fortune,
      color: 'bg-yellow-50',
    },
    {
      icon: <FaBriefcase className="text-blue-500" />,
      title: '직업운',
      content: result.career,
      color: 'bg-blue-50',
    },
    {
      icon: <FaHeart className="text-red-500" />,
      title: '애정운',
      content: result.relationship,
      color: 'bg-red-50',
    },
    {
      icon: <FaHeartbeat className="text-green-500" />,
      title: '건강운',
      content: result.health,
      color: 'bg-green-50',
    },
    {
      icon: <FaLightbulb className="text-amber-500" />,
      title: '조언',
      content: result.advice,
      color: 'bg-amber-50',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* 기본 정보 */}
      <div className="card">
        <h2 className="text-3xl font-bold text-gradient mb-4 text-center">
          사주 분석 결과
        </h2>
        <div className="text-center text-gray-600 mb-6">
          <p className="text-lg">
            {calendar} {year}년 {month}월 {day}일 {hour}시 {minute}분 ({genderText})
          </p>
        </div>

        {/* 사주팔자 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">년주</p>
            <p className="text-xl font-bold text-purple-700">{result.yearPillar}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">월주</p>
            <p className="text-xl font-bold text-blue-700">{result.monthPillar}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">일주</p>
            <p className="text-xl font-bold text-green-700">{result.dayPillar}</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl text-center">
            <p className="text-sm text-gray-600 mb-1">시주</p>
            <p className="text-xl font-bold text-amber-700">{result.hourPillar}</p>
          </div>
        </div>
      </div>

      {/* 분석 섹션들 */}
      <div className="grid md:grid-cols-2 gap-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="card hover:scale-105 transition-transform duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`p-4 ${section.color} rounded-lg mb-4`}>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{section.icon}</div>
                <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
              </div>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      {/* 행운의 색상 및 숫자 */}
      <div className="card">
        <div className="grid md:grid-cols-2 gap-6">
          {/* 행운의 색상 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaPalette className="text-2xl text-primary-500" />
              <h3 className="text-xl font-bold text-gray-800">행운의 색상</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {result.luckyColors?.map((color, index) => (
                <div
                  key={index}
                  className="px-6 py-3 rounded-full font-medium shadow-md"
                  style={{
                    backgroundColor: getColorCode(color),
                    color: isLightColor(color) ? '#1f2937' : '#ffffff',
                  }}
                >
                  {color}
                </div>
              ))}
            </div>
          </div>

          {/* 행운의 숫자 */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FaDice className="text-2xl text-secondary-500" />
              <h3 className="text-xl font-bold text-gray-800">행운의 숫자</h3>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              {result.luckyNumbers?.map((number, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg"
                >
                  {number}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button onClick={onNewAnalysis} className="btn-secondary">
          다시 분석하기
        </button>
      </div>
    </div>
  );
};

// 색상 이름을 색상 코드로 변환
const getColorCode = (colorName) => {
  const colorMap = {
    빨강: '#ef4444',
    빨간색: '#ef4444',
    주황: '#f97316',
    주황색: '#f97316',
    노랑: '#eab308',
    노란색: '#eab308',
    초록: '#22c55e',
    초록색: '#22c55e',
    파랑: '#3b82f6',
    파란색: '#3b82f6',
    남색: '#4f46e5',
    보라: '#a855f7',
    보라색: '#a855f7',
    분홍: '#ec4899',
    분홍색: '#ec4899',
    하양: '#f3f4f6',
    하얀색: '#f3f4f6',
    검정: '#1f2937',
    검은색: '#1f2937',
    회색: '#6b7280',
    금색: '#fbbf24',
    은색: '#d1d5db',
  };

  return colorMap[colorName] || colorMap[colorName?.replace('색', '')] || '#8b5cf6';
};

// 밝은 색상인지 판단
const isLightColor = (colorName) => {
  const lightColors = ['하양', '하얀색', '노랑', '노란색', '은색', '금색'];
  return lightColors.includes(colorName);
};

export default SajuResult;
