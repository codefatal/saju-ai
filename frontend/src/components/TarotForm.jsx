import React, { useState, useEffect } from 'react';
import { FaMagic } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

const TarotForm = ({ onSubmit, isLoading }) => {
  const { user, loadUserProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    question: '',
    category: 'GENERAL',
    name: '',
  });
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Auto-load user profile if logged in
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !profileLoaded) {
        try {
          const profile = await loadUserProfile();
          if (profile && profile.name) {
            setFormData(prev => ({ ...prev, name: profile.name }));
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

  const categories = [
    { value: 'GENERAL', label: '종합운', icon: '🔮' },
    { value: 'LOVE', label: '연애운', icon: '💕' },
    { value: 'CAREER', label: '직업운', icon: '💼' },
    { value: 'MONEY', label: '재물운', icon: '💰' },
    { value: 'HEALTH', label: '건강운', icon: '🏥' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.question.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-900 rounded-2xl shadow-2xl p-8 border border-purple-500/30">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-500/20 rounded-full mb-4">
            <FaMagic className="text-5xl text-purple-300" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">타로 카드 리딩</h2>
          <p className="text-purple-200">마음 속 질문을 떠올리며 카드를 선택하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input (Optional) */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              이름 (선택)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
              disabled={isLoading}
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-3">
              질문 카테고리
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => handleChange('category', category.value)}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    formData.category === category.value
                      ? 'bg-purple-500/40 border-purple-400 shadow-lg shadow-purple-500/50'
                      : 'bg-white/5 border-purple-500/30 hover:bg-white/10 hover:border-purple-400/50'
                  }`}
                  disabled={isLoading}
                >
                  <div className="text-3xl mb-2">{category.icon}</div>
                  <div className="text-sm font-medium text-white">{category.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Input */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              질문 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.question}
              onChange={(e) => handleChange('question', e.target.value)}
              placeholder="타로 카드에게 묻고 싶은 질문을 입력하세요&#10;예: 새로운 일을 시작하는 것이 좋을까요?"
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-white/10 border border-purple-400/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition resize-none"
              disabled={isLoading}
              required
            />
            <p className="mt-2 text-sm text-purple-300/70">
              구체적이고 열린 질문일수록 더 정확한 리딩을 받을 수 있습니다
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.question.trim()}
            className="w-full py-4 px-6 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                카드를 펼치는 중...
              </>
            ) : (
              <>
                <FaMagic className="text-xl" />
                카드 펼치기
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
          <p className="text-sm text-purple-200 text-center">
            💫 타로 카드는 과거-현재-미래 3장의 카드로 여러분의 질문에 답합니다
          </p>
        </div>
      </div>
    </div>
  );
};

export default TarotForm;
