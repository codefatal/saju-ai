import { useState } from 'react';
import { FaCalendarAlt, FaExchangeAlt, FaMoon, FaSun, FaStar } from 'react-icons/fa';

const CalendarConverter = ({ onConvert }) => {
  const currentDate = new Date();
  const [formData, setFormData] = useState({
    year: currentDate.getFullYear(),
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
    isLunar: false,
    isLeapMonth: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : parseInt(value) || value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.year || formData.year < 1900 || formData.year > 2100) {
      newErrors.year = '년도는 1900~2100 사이여야 합니다';
    }

    if (!formData.month || formData.month < 1 || formData.month > 12) {
      newErrors.month = '월은 1~12 사이여야 합니다';
    }

    if (!formData.day || formData.day < 1 || formData.day > 31) {
      newErrors.day = '일은 1~31 사이여야 합니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onConvert(formData);
    }
  };

  const toggleCalendarType = () => {
    setFormData((prev) => ({
      ...prev,
      isLunar: !prev.isLunar,
      isLeapMonth: false, // 양력으로 바뀌면 윤달 체크 해제
    }));
  };

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <FaCalendarAlt className="text-5xl text-primary-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">음력/양력 변환기</h2>
        <p className="text-gray-600">날짜를 입력하고 음력과 양력을 변환하세요</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 달력 타입 토글 */}
        <div className="flex items-center justify-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className={`flex items-center space-x-2 ${!formData.isLunar ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
            <FaSun className="text-2xl" />
            <span>양력</span>
          </div>

          <button
            type="button"
            onClick={toggleCalendarType}
            className="relative inline-flex items-center h-12 w-24 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            style={{ backgroundColor: formData.isLunar ? '#9333ea' : '#3b82f6' }}
          >
            <span
              className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                formData.isLunar ? 'translate-x-12' : 'translate-x-1'
              }`}
            >
              <FaExchangeAlt className="text-xl text-gray-600 m-2.5" />
            </span>
          </button>

          <div className={`flex items-center space-x-2 ${formData.isLunar ? 'text-purple-600 font-bold' : 'text-gray-500'}`}>
            <FaMoon className="text-2xl" />
            <span>음력</span>
          </div>
        </div>

        {/* 날짜 입력 */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              년도
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="예: 1990"
            />
            {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              월
            </label>
            <input
              type="number"
              name="month"
              value={formData.month}
              onChange={handleChange}
              min="1"
              max="12"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.month ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1-12"
            />
            {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일
            </label>
            <input
              type="number"
              name="day"
              value={formData.day}
              onChange={handleChange}
              min="1"
              max="31"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.day ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="1-31"
            />
            {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day}</p>}
          </div>
        </div>

        {/* 윤달 체크박스 (음력일 때만 표시) */}
        {formData.isLunar && (
          <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
            <input
              type="checkbox"
              name="isLeapMonth"
              id="isLeapMonth"
              checked={formData.isLeapMonth}
              onChange={handleChange}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <label htmlFor="isLeapMonth" className="flex items-center space-x-2 text-gray-700 cursor-pointer">
              <FaStar className="text-purple-500" />
              <span>윤달입니다</span>
            </label>
          </div>
        )}

        {/* 변환 버튼 */}
        <button
          type="submit"
          className="w-full btn-primary py-4 text-lg font-bold"
        >
          <FaExchangeAlt className="inline mr-2" />
          변환하기
        </button>
      </form>
    </div>
  );
};

export default CalendarConverter;
