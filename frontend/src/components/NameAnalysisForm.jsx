import { useState, useEffect } from 'react';
import { FaPen, FaUser, FaMale, FaFemale } from 'react-icons/fa';
import PropTypes from 'prop-types';
import useAuthStore from '../store/useAuthStore';

const NameAnalysisForm = ({ onSubmit, isLoading }) => {
  const { user, loadUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    purpose: 'CURRENT',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: 'MALE',
  });

  const [includeBirthData, setIncludeBirthData] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-load user profile if logged in
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !profileLoaded) {
        try {
          const profile = await loadUserProfile();
          if (profile) {
            setFormData({
              name: profile.name || '',
              purpose: 'CURRENT',
              birthYear: profile.year || '',
              birthMonth: profile.month || '',
              birthDay: profile.day || '',
              gender: profile.gender || 'MALE',
            });
            if (profile.year && profile.month && profile.day) {
              setIncludeBirthData(true);
            }
          }
          setProfileLoaded(true);
        } catch (error) {
          console.error('Failed to load profile:', error);
          setProfileLoaded(true);
        }
      }
    };

    loadProfile();
  }, [user, profileLoaded, loadUserProfile]);

  const purposes = [
    { value: 'CURRENT', label: '현재 이름 분석', description: '지금 사용하는 이름 분석' },
    { value: 'NEW', label: '작명/개명 평가', description: '새로운 이름 적합성 평가' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert('이름을 입력해주세요');
      return;
    }

    const requestData = {
      name: formData.name,
      purpose: formData.purpose,
    };

    // 생년월일 정보가 포함된 경우
    if (includeBirthData && formData.birthYear && formData.birthMonth && formData.birthDay) {
      requestData.birthYear = parseInt(formData.birthYear);
      requestData.birthMonth = parseInt(formData.birthMonth);
      requestData.birthDay = parseInt(formData.birthDay);
      requestData.gender = formData.gender;
    }

    onSubmit(requestData);
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mb-4">
          <FaPen className="text-3xl text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">이름 풀이</h2>
        <p className="text-gray-600 mt-2">성명학으로 이름의 의미를 분석합니다</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 이름 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FaUser className="inline mr-2" />
            이름
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="예: 홍길동"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            required
          />
          <p className="text-sm text-gray-500 mt-1">한글 또는 한자로 입력해주세요</p>
        </div>

        {/* 목적 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">분석 목적</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {purposes.map((purpose) => (
              <button
                key={purpose.value}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, purpose: purpose.value }))}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  formData.purpose === purpose.value
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="font-medium text-gray-800">{purpose.label}</div>
                <div className="text-sm text-gray-600 mt-1">{purpose.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 사주 정보 포함 옵션 */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={includeBirthData}
              onChange={(e) => setIncludeBirthData(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-3 text-gray-700 font-medium">
              생년월일 정보 포함 (사주와의 궁합 분석)
            </span>
          </label>
        </div>

        {/* 생년월일 입력 */}
        {includeBirthData && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">년</label>
                <input
                  type="number"
                  name="birthYear"
                  value={formData.birthYear}
                  onChange={handleChange}
                  placeholder="1990"
                  min="1900"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">월</label>
                <input
                  type="number"
                  name="birthMonth"
                  value={formData.birthMonth}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  max="12"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">일</label>
                <input
                  type="number"
                  name="birthDay"
                  value={formData.birthDay}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  max="31"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* 성별 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'MALE' }))}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    formData.gender === 'MALE'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <FaMale className="inline mr-2" />
                  남성
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, gender: 'FEMALE' }))}
                  className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                    formData.gender === 'FEMALE'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-pink-300'
                  }`}
                >
                  <FaFemale className="inline mr-2" />
                  여성
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 disabled:transform-none"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              분석 중...
            </span>
          ) : (
            '이름 분석 시작'
          )}
        </button>
      </form>
    </div>
  );
};

NameAnalysisForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
};

export default NameAnalysisForm;
