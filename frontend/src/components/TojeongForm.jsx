import React, { useState } from 'react';
import { FaBook } from 'react-icons/fa';
import BirthForm from './BirthForm';

const TojeongForm = ({ onSubmit, isLoading }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [birthData, setBirthData] = useState(null);

  const handleBirthDataChange = (data) => {
    setBirthData(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (birthData) {
      onSubmit({
        year: year,
        birthYear: birthData.year,
        birthMonth: birthData.month,
        birthDay: birthData.day,
        gender: birthData.gender,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-amber-900 via-yellow-900 to-orange-900 rounded-2xl shadow-2xl p-8 border border-amber-500/30">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-amber-500/20 rounded-full mb-4">
            <FaBook className="text-5xl text-amber-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">토정비결</h2>
          <p className="text-amber-200">전통 토정비결로 연운을 확인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Year Selection */}
          <div>
            <label className="block text-sm font-medium text-amber-200 mb-2">
              조회할 연도 <span className="text-red-400">*</span>
            </label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-amber-400/30 text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              disabled={isLoading}
            >
              {[...Array(5)].map((_, i) => {
                const y = new Date().getFullYear() + i;
                return <option key={y} value={y}>{y}년</option>;
              })}
            </select>
          </div>

          {/* Birth Date Form */}
          <div className="bg-white/5 rounded-lg p-4 border border-amber-400/20">
            <h3 className="text-sm font-medium text-amber-200 mb-3">생년월일 정보</h3>
            <BirthForm onChange={handleBirthDataChange} />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !birthData}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                토정비결 보는 중...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3">
                <FaBook className="text-xl" />
                {year}년 운세 보기
              </div>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-amber-500/10 rounded-lg border border-amber-400/20">
          <p className="text-sm text-amber-200 text-center">
            📖 전통 토정비결로 12개월 운세를 제공합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default TojeongForm;
