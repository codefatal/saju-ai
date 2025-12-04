import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaVenusMars,
  FaMoon,
  FaGoogle,
  FaComment,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
} from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

function MyPage() {
  const navigate = useNavigate();
  const { user, logout, isLoading: authLoading, saveProfile, loadUserProfile } = useAuthStore();
  const [profileData, setProfileData] = useState({
    name: '',
    year: null,
    month: null,
    day: null,
    hour: null,
    minute: null,
    gender: 'NOT_SPECIFIED',
    isLunar: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load user profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !profileLoaded) {
        try {
          const profile = await loadUserProfile();
          if (profile) {
            setProfileData({
              name: profile.name || '',
              year: profile.year,
              month: profile.month,
              day: profile.day,
              hour: profile.hour,
              minute: profile.minute,
              gender: profile.gender || 'NOT_SPECIFIED',
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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage('');

    try {
      const dataToSave = {
        name: profileData.name,
        year: profileData.year,
        month: profileData.month,
        day: profileData.day,
        hour: profileData.hour,
        minute: profileData.minute,
        gender: profileData.gender,
        isLunar: profileData.isLunar,
      };

      await saveProfile(dataToSave);
      setMessage('프로필이 저장되었습니다.');
      setIsEditing(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('프로필 저장 중 오류가 발생했습니다.');
      console.error('Save profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('정말 로그아웃하시겠습니까?')) {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
  };

  const isProfileComplete =
    profileData.year &&
    profileData.month &&
    profileData.day &&
    profileData.gender !== 'NOT_SPECIFIED';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            마이페이지
          </h1>
          <p className="text-gray-400">
            사주팔자 정보를 입력하고 관리하세요
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="bg-green-900 bg-opacity-30 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <FaCheckCircle /> {message}
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-pink-600 flex items-center justify-center">
              <FaUser className="text-2xl text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Provider Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-800">
            <div className="flex items-center gap-3">
              {user?.provider === 'GOOGLE' ? (
                <>
                  <FaGoogle className="text-2xl text-red-500" />
                  <span className="text-gray-400">Google 계정으로 로그인됨</span>
                </>
              ) : user?.provider === 'KAKAO' ? (
                <>
                  <FaComment className="text-2xl text-yellow-400" />
                  <span className="text-gray-400">Kakao 계정으로 로그인됨</span>
                </>
              ) : (
                <span className="text-gray-400">기본 계정</span>
              )}
            </div>

            {/* Profile Status */}
            <div className="flex items-center gap-3">
              {isProfileComplete ? (
                <>
                  <FaCheckCircle className="text-2xl text-green-500" />
                  <span className="text-green-400">프로필 완성됨</span>
                </>
              ) : (
                <>
                  <FaTimes className="text-2xl text-yellow-500" />
                  <span className="text-yellow-400">프로필 미완성</span>
                </>
              )}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FaSignOutAlt /> 로그아웃
          </button>
        </div>

        {/* Birth Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <FaCalendarAlt className="text-purple-400" />
              사주팔자 정보
            </h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              {isEditing ? '취소' : '수정'}
            </button>
          </div>

          {!isEditing && !isProfileComplete && (
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg mb-6">
              💡 사주팔자 분석을 위해 생년월일시를 입력해주세요.
            </div>
          )}

          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-400 text-sm font-medium mb-2">
              <FaUser className="inline mr-2" />
              이름
            </label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleInputChange}
              disabled={!isEditing}
              placeholder="이름을 입력하세요"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
            />
          </div>

          {/* Birth Date Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Year */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <FaCalendarAlt className="inline mr-2" />
                출생 연도
              </label>
              <input
                type="number"
                name="year"
                min="1900"
                max={new Date().getFullYear()}
                value={profileData.year}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="예: 1990"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            {/* Month */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                출생 월
              </label>
              <select
                name="month"
                value={profileData.month}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="">선택하세요</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>

            {/* Day */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                출생 일
              </label>
              <select
                name="day"
                value={profileData.day}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="">선택하세요</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <FaVenusMars className="inline mr-2" />
                성별
              </label>
              <select
                name="gender"
                value={profileData.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="NOT_SPECIFIED">선택하세요</option>
                <option value="MALE">남성</option>
                <option value="FEMALE">여성</option>
              </select>
            </div>
          </div>

          {/* Birth Time Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Hour */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                <FaClock className="inline mr-2" />
                출생 시간 (시)
              </label>
              <select
                name="hour"
                value={profileData.hour}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="">선택하세요 (선택사항)</option>
                {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                  <option key={hour} value={hour}>
                    {String(hour).padStart(2, '0')}:00
                  </option>
                ))}
              </select>
            </div>

            {/* Minute */}
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">
                출생 분 (분)
              </label>
              <select
                name="minute"
                value={profileData.minute}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-500 disabled:opacity-50"
              >
                <option value="">선택하세요 (선택사항)</option>
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <option key={minute} value={minute}>
                    :{String(minute).padStart(2, '0')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lunar Calendar Toggle */}
          <div className="flex items-center gap-3 mb-6">
            <input
              type="checkbox"
              name="isLunar"
              id="isLunar"
              checked={profileData.isLunar}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 rounded cursor-pointer"
            />
            <label
              htmlFor="isLunar"
              className="text-gray-400 cursor-pointer flex items-center gap-2"
            >
              <FaMoon className="text-purple-400" />
              음력으로 입력됨
            </label>
          </div>

          {/* Save Button */}
          {isEditing && (
            <button
              onClick={handleSaveProfile}
              disabled={isLoading || !isProfileComplete}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '저장 중...' : '프로필 저장'}
            </button>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">도움말</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li>✓ 음력/양력 구분: 정확한 분석을 위해 반드시 지정해주세요</li>
            <li>✓ 시간 정보: 시간 정보가 없으신 경우 생략하셔도 됩니다</li>
            <li>✓ 분석 공유: 분석 결과에서 손쉽게 소셜 미디어에 공유할 수 있습니다</li>
            <li>✓ 자동 저장: 분석 시 입력하신 정보가 자동으로 저장됩니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
