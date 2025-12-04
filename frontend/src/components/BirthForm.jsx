import { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaVenusMars } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

const BirthForm = ({ onSubmit, isLoading }) => {
  const { user, loadUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
    gender: 'MALE',
    isLunar: false,
  });

  const [errors, setErrors] = useState({});
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-load user profile if logged in
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !profileLoaded) {
        try {
          const profile = await loadUserProfile();
          if (profile && profile.year) {
            setFormData({
              year: profile.year || '',
              month: profile.month || '',
              day: profile.day || '',
              hour: profile.hour !== undefined ? profile.hour : '',
              minute: profile.minute !== undefined ? profile.minute : '',
              gender: profile.gender || 'MALE',
              isLunar: profile.isLunar || false,
            });
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

  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.year || formData.year < 1900 || formData.year > currentYear) {
      newErrors.year = '1900년에서 현재 사이의 년도를 입력하세요';
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = '1-12 사이의 월을 입력하세요';
    }

    if (!formData.day || formData.day < 1 || formData.day > 31) {
      newErrors.day = '1-31 사이의 일을 입력하세요';
    }

    if (formData.hour === '' || formData.hour < 0 || formData.hour > 23) {
      newErrors.hour = '0-23 사이의 시간을 입력하세요';
    }

    if (formData.minute === '' || formData.minute < 0 || formData.minute > 59) {
      newErrors.minute = '0-59 사이의 분을 입력하세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let processedValue = value;
    if (type === 'number') {
      // 빈 문자열이면 그대로 유지
      if (value === '') {
        processedValue = '';
      } else {
        // 숫자로 변환, 0도 유효한 값으로 처리
        const num = parseInt(value, 10);
        processedValue = isNaN(num) ? '' : num;
      }
    } else if (type === 'checkbox') {
      processedValue = checked;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="card max-w-2xl mx-auto animate-slide-up">
      <h2 className="text-3xl font-bold text-gradient mb-6 text-center">
        생년월일 입력
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 양력/음력 선택 */}
        <div className="flex items-center justify-center space-x-8 p-4 bg-purple-50 rounded-lg">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="isLunar"
              value="false"
              checked={!formData.isLunar}
              onChange={() => setFormData((prev) => ({ ...prev, isLunar: false }))}
              className="w-5 h-5 text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-lg font-medium text-gray-700">양력</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="isLunar"
              value="true"
              checked={formData.isLunar}
              onChange={() => setFormData((prev) => ({ ...prev, isLunar: true }))}
              className="w-5 h-5 text-primary-500 focus:ring-primary-500"
            />
            <span className="ml-2 text-lg font-medium text-gray-700">음력</span>
          </label>
        </div>

        {/* 생년월일 */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaCalendarAlt className="mr-2 text-primary-500" />
            생년월일
          </label>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="년도"
                className={`input-field ${errors.year ? 'border-red-500' : ''}`}
              />
              {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
            </div>
            <div>
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleChange}
                placeholder="월"
                className={`input-field ${errors.month ? 'border-red-500' : ''}`}
              />
              {errors.month && <p className="text-red-500 text-sm mt-1">{errors.month}</p>}
            </div>
            <div>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleChange}
                placeholder="일"
                className={`input-field ${errors.day ? 'border-red-500' : ''}`}
              />
              {errors.day && <p className="text-red-500 text-sm mt-1">{errors.day}</p>}
            </div>
          </div>
        </div>

        {/* 시간 */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaClock className="mr-2 text-primary-500" />
            시간
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleChange}
                placeholder="시 (0-23)"
                className={`input-field ${errors.hour ? 'border-red-500' : ''}`}
              />
              {errors.hour && <p className="text-red-500 text-sm mt-1">{errors.hour}</p>}
            </div>
            <div>
              <input
                type="number"
                name="minute"
                value={formData.minute}
                onChange={handleChange}
                placeholder="분 (0-59)"
                className={`input-field ${errors.minute ? 'border-red-500' : ''}`}
              />
              {errors.minute && <p className="text-red-500 text-sm mt-1">{errors.minute}</p>}
            </div>
          </div>
        </div>

        {/* 성별 */}
        <div>
          <label className="flex items-center text-gray-700 font-medium mb-2">
            <FaVenusMars className="mr-2 text-primary-500" />
            성별
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center cursor-pointer flex-1 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="gender"
                value="MALE"
                checked={formData.gender === 'MALE'}
                onChange={handleChange}
                className="w-5 h-5 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-3 text-lg font-medium text-gray-700">남성</span>
            </label>
            <label className="flex items-center cursor-pointer flex-1 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="gender"
                value="FEMALE"
                checked={formData.gender === 'FEMALE'}
                onChange={handleChange}
                className="w-5 h-5 text-primary-500 focus:ring-primary-500"
              />
              <span className="ml-3 text-lg font-medium text-gray-700">여성</span>
            </label>
          </div>
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full text-lg py-4"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              분석 중...
            </span>
          ) : (
            '사주 분석하기'
          )}
        </button>
      </form>
    </div>
  );
};

export default BirthForm;
