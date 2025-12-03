import React, { useState } from 'react';
import { FaMoon } from 'react-icons/fa';

const DreamForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    dreamContent: '',
    category: 'OTHER',
    mood: 'NEUTRAL',
    name: '',
  });

  const categories = [
    { value: 'PERSON', label: '사람', icon: '👤', description: '사람이 등장하는 꿈' },
    { value: 'ANIMAL', label: '동물', icon: '🐾', description: '동물이 나오는 꿈' },
    { value: 'NATURE', label: '자연', icon: '🌳', description: '자연 현상 관련 꿈' },
    { value: 'OBJECT', label: '사물', icon: '📦', description: '물건이 나오는 꿈' },
    { value: 'ACTION', label: '행동', icon: '🏃', description: '특정 행동을 하는 꿈' },
    { value: 'EMOTION', label: '감정', icon: '❤️', description: '감정이 중심인 꿈' },
    { value: 'OTHER', label: '기타', icon: '✨', description: '그 외 모든 꿈' },
  ];

  const moods = [
    { value: 'POSITIVE', label: '긍정적', icon: '😊', color: 'bg-green-500/20 border-green-400' },
    { value: 'NEUTRAL', label: '중립적', icon: '😐', color: 'bg-gray-500/20 border-gray-400' },
    { value: 'NEGATIVE', label: '부정적', icon: '😰', color: 'bg-red-500/20 border-red-400' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.dreamContent.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-2xl shadow-2xl p-8 border border-indigo-500/30">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-indigo-500/20 rounded-full mb-4">
            <FaMoon className="text-5xl text-indigo-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">꿈 해몽</h2>
          <p className="text-indigo-200">꿈의 의미를 풀어드립니다</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              이름 (선택)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
              disabled={isLoading}
            />
          </div>

          {/* Dream Category */}
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-3">
              꿈 카테고리
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleChange('category', category.value)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.category === category.value
                      ? 'bg-indigo-500/40 border-indigo-400 shadow-lg shadow-indigo-500/50'
                      : 'bg-white/5 border-indigo-500/30 hover:bg-white/10 hover:border-indigo-400/50'
                  }`}
                  disabled={isLoading}
                  title={category.description}
                >
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-white">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dream Mood */}
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-3">
              꿈의 분위기
            </label>
            <div className="grid grid-cols-3 gap-3">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => handleChange('mood', mood.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.mood === mood.value
                      ? mood.color + ' shadow-lg'
                      : 'bg-white/5 border-indigo-500/30 hover:bg-white/10'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-3xl mb-2">{mood.icon}</div>
                  <div className="text-sm font-medium text-white">{mood.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Dream Content */}
          <div>
            <label className="block text-sm font-medium text-indigo-200 mb-2">
              꿈 내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.dreamContent}
              onChange={(e) => handleChange('dreamContent', e.target.value)}
              placeholder="꿈에서 본 내용을 자세히 적어주세요&#10;예: 하늘을 날고 있었는데 갑자기 떨어지기 시작했어요..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-indigo-400/30 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition resize-none"
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-sm text-indigo-300/70">
              꿈의 장소, 등장인물, 감정, 행동 등을 자세히 적을수록 정확한 해몽을 받을 수 있습니다
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.dreamContent.trim()}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                해몽하는 중...
              </>
            ) : (
              <>
                <FaMoon className="text-xl" />
                꿈 해석하기
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-indigo-500/10 rounded-lg border border-indigo-400/20">
          <p className="text-sm text-indigo-200 text-center">
            🌙 심리학적 해석과 전통 해몽을 결합하여 꿈의 의미를 풀어드립니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default DreamForm;
