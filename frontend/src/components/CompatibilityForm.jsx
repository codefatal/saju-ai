import { useState } from 'react';
import { FaHeart, FaUser, FaCalendarAlt, FaClock, FaVenusMars } from 'react-icons/fa';
import BirthForm from './BirthForm';

const CompatibilityForm = ({ onAnalyze }) => {
  const [person1Data, setPerson1Data] = useState(null);
  const [person2Data, setPerson2Data] = useState(null);
  const [person1Name, setPerson1Name] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [currentPerson, setCurrentPerson] = useState(1);

  const handlePerson1Submit = (birthData) => {
    setPerson1Data(birthData);
    setCurrentPerson(2);
  };

  const handlePerson2Submit = (birthData) => {
    setPerson2Data(birthData);
  };

  const handleFinalSubmit = () => {
    if (person1Data && person2Data) {
      const compatibilityData = {
        person1Year: person1Data.year,
        person1Month: person1Data.month,
        person1Day: person1Data.day,
        person1Hour: person1Data.hour,
        person1Minute: person1Data.minute,
        person1Gender: person1Data.gender,
        person1IsLunar: person1Data.isLunar,
        person1Name: person1Name || undefined,
        person2Year: person2Data.year,
        person2Month: person2Data.month,
        person2Day: person2Data.day,
        person2Hour: person2Data.hour,
        person2Minute: person2Data.minute,
        person2Gender: person2Data.gender,
        person2IsLunar: person2Data.isLunar,
        person2Name: person2Name || undefined,
      };
      onAnalyze(compatibilityData);
    }
  };

  const resetPerson1 = () => {
    setPerson1Data(null);
    setPerson1Name('');
    setCurrentPerson(1);
  };

  const resetPerson2 = () => {
    setPerson2Data(null);
    setPerson2Name('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* 헤더 */}
      <div className="card text-center">
        <FaHeart className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
        <h2 className="text-3xl font-bold text-gradient mb-3">궁합 분석</h2>
        <p className="text-gray-600 text-lg">두 사람의 생년월일시를 입력하여 궁합을 확인하세요</p>
      </div>

      {/* 진행 상태 */}
      <div className="flex items-center justify-center space-x-4">
        <div className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${person1Data ? 'bg-green-100' : currentPerson === 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <FaUser className={`text-2xl ${person1Data ? 'text-green-600' : currentPerson === 1 ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`font-bold ${person1Data ? 'text-green-700' : currentPerson === 1 ? 'text-blue-700' : 'text-gray-500'}`}>
            첫 번째 사람
          </span>
        </div>

        <FaHeart className="text-3xl text-pink-400" />

        <div className={`flex items-center space-x-2 px-6 py-3 rounded-lg ${person2Data ? 'bg-green-100' : currentPerson === 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
          <FaUser className={`text-2xl ${person2Data ? 'text-green-600' : currentPerson === 2 ? 'text-blue-600' : 'text-gray-400'}`} />
          <span className={`font-bold ${person2Data ? 'text-green-700' : currentPerson === 2 ? 'text-blue-700' : 'text-gray-500'}`}>
            두 번째 사람
          </span>
        </div>
      </div>

      {/* 첫 번째 사람 정보 */}
      {!person1Data && currentPerson === 1 && (
        <div className="card animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaUser className="text-blue-500" />
            <span>첫 번째 사람 정보 입력</span>
          </h3>

          {/* 이름 입력 (선택사항) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 (선택사항)
            </label>
            <input
              type="text"
              value={person1Name}
              onChange={(e) => setPerson1Name(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="예: 홍길동"
            />
          </div>

          <BirthForm onSubmit={handlePerson1Submit} />
        </div>
      )}

      {/* 첫 번째 사람 확인 카드 */}
      {person1Data && (
        <div className="card bg-gradient-to-br from-blue-50 to-cyan-50 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-blue-700 mb-2">
                {person1Name || '첫 번째 사람'}
              </h4>
              <p className="text-gray-700">
                {person1Data.isLunar ? '음력' : '양력'} {person1Data.year}년 {person1Data.month}월 {person1Data.day}일 {person1Data.hour}시 {person1Data.minute}분
              </p>
              <p className="text-gray-600">
                ({person1Data.gender === 'MALE' ? '남성' : '여성'})
              </p>
            </div>
            <button onClick={resetPerson1} className="btn-secondary">
              수정
            </button>
          </div>
        </div>
      )}

      {/* 두 번째 사람 정보 */}
      {person1Data && !person2Data && currentPerson === 2 && (
        <div className="card animate-fade-in">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
            <FaUser className="text-purple-500" />
            <span>두 번째 사람 정보 입력</span>
          </h3>

          {/* 이름 입력 (선택사항) */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 (선택사항)
            </label>
            <input
              type="text"
              value={person2Name}
              onChange={(e) => setPerson2Name(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="예: 김영희"
            />
          </div>

          <BirthForm onSubmit={handlePerson2Submit} />
        </div>
      )}

      {/* 두 번째 사람 확인 카드 */}
      {person2Data && (
        <div className="card bg-gradient-to-br from-purple-50 to-pink-50 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xl font-bold text-purple-700 mb-2">
                {person2Name || '두 번째 사람'}
              </h4>
              <p className="text-gray-700">
                {person2Data.isLunar ? '음력' : '양력'} {person2Data.year}년 {person2Data.month}월 {person2Data.day}일 {person2Data.hour}시 {person2Data.minute}분
              </p>
              <p className="text-gray-600">
                ({person2Data.gender === 'MALE' ? '남성' : '여성'})
              </p>
            </div>
            <button onClick={resetPerson2} className="btn-secondary">
              수정
            </button>
          </div>
        </div>
      )}

      {/* 최종 분석 버튼 */}
      {person1Data && person2Data && (
        <div className="text-center animate-fade-in">
          <button onClick={handleFinalSubmit} className="btn-primary text-xl px-12 py-4">
            <FaHeart className="inline mr-2" />
            궁합 분석하기
          </button>
        </div>
      )}
    </div>
  );
};

export default CompatibilityForm;
