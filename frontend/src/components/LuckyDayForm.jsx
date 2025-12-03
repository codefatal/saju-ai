import React, { useState } from 'react';
import { FaCalendarCheck } from 'react-icons/fa';

const LuckyDayForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    purpose: 'MARRIAGE',
    startDate: '',
    endDate: '',
    birthYear: '',
    birthMonth: '',
    birthDay: '',
    gender: 'MALE',
  });

  const purposes = [
    { value: 'MARRIAGE', label: '결혼', icon: '💒' },
    { value: 'MOVING', label: '이사', icon: '🚚' },
    { value: 'BUSINESS_START', label: '개업', icon: '🏪' },
    { value: 'CONTRACT', label: '계약', icon: '📝' },
    { value: 'TRAVEL', label: '여행', icon: '✈️' },
    { value: 'IMPORTANT_MEETING', label: '중요한 만남', icon: '🤝' },
    { value: 'OTHER', label: '기타', icon: '📅' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      purpose: formData.purpose,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    // 생년월일 정보가 있으면 추가
    if (formData.birthYear && formData.birthMonth && formData.birthDay) {
      data.birthYear = parseInt(formData.birthYear);
      data.birthMonth = parseInt(formData.birthMonth);
      data.birthDay = parseInt(formData.birthDay);
      data.gender = formData.gender;
    }

    onSubmit(data);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 rounded-2xl shadow-2xl p-8 border border-green-500/30">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-500/20 rounded-full mb-4">
            <FaCalendarCheck className="text-5xl text-green-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">길일 선택</h2>
          <p className="text-green-200">좋은 날을 선택하여 일을 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-green-200 mb-3">
              목적 <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {purposes.map((purpose) => (
                <button
                  key={purpose.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, purpose: purpose.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.purpose === purpose.value
                      ? 'bg-green-500/40 border-green-400 shadow-lg'
                      : 'bg-white/5 border-green-500/30 hover:bg-white/10'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-2xl mb-1">{purpose.icon}</div>
                  <div className="text-xs font-medium text-white">{purpose.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                시작 날짜 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-green-400/30 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-green-200 mb-2">
                종료 날짜 <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-green-400/30 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          {/* Birth Info (Optional) */}
          <div className="bg-white/5 rounded-lg p-4 border border-green-400/20">
            <h3 className="text-sm font-medium text-green-200 mb-3">생년월일 (선택 - 더 정확한 길일 선택)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="number"
                placeholder="연도"
                value={formData.birthYear}
                onChange={(e) => setFormData(prev => ({ ...prev, birthYear: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-white/10 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
                min="1900"
                max="2100"
              />
              <input
                type="number"
                placeholder="월"
                value={formData.birthMonth}
                onChange={(e) => setFormData(prev => ({ ...prev, birthMonth: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-white/10 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
                min="1"
                max="12"
              />
              <input
                type="number"
                placeholder="일"
                value={formData.birthDay}
                onChange={(e) => setFormData(prev => ({ ...prev, birthDay: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-white/10 border border-green-400/30 text-white placeholder-green-300/50 focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
                min="1"
                max="31"
              />
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                className="px-3 py-2 rounded-lg bg-white/10 border border-green-400/30 text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                disabled={isLoading}
              >
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                길일 찾는 중...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FaCalendarCheck className="text-xl" />
                길일 찾기
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-green-500/10 rounded-lg border border-green-400/20">
          <p className="text-sm text-green-200 text-center">
            📅 전통 택일학에 기반하여 좋은 날을 추천해드립니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default LuckyDayForm;
