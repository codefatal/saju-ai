import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaComment } from 'react-icons/fa';
import useAuthStore from '../store/useAuthStore';

function LoginPage() {
  const navigate = useNavigate();
  const { user, isLoading, error } = useAuthStore();

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/callback`;

  // If user is already authenticated, redirect to home
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent('openid email profile')}&` +
      `state=google`;

    window.location.href = googleAuthUrl;
  };

  const handleKakaoLogin = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?` +
      `client_id=${kakaoClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `state=kakao`;

    window.location.href = kakaoAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              모두의 사주AI
            </h1>
            <p className="text-gray-400 text-sm">
              소셜 로그인으로 시작하기
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-4">
            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-xl text-red-500" />
              <span>Google로 로그인</span>
            </button>

            {/* Kakao Login */}
            <button
              onClick={handleKakaoLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaComment className="text-xl text-gray-900" />
              <span>Kakao로 로그인</span>
            </button>
          </div>

          {/* Info Message */}
          <div className="mt-8 p-4 bg-blue-900 bg-opacity-30 border border-blue-700 rounded-lg">
            <p className="text-blue-300 text-sm leading-relaxed">
              💡 <strong>팁:</strong> 로그인 후 마이페이지에서 사주팔자에 필요한 정보를 입력할 수 있습니다. 분석 시 정보를 추가하면 자동으로 저장됩니다.
            </p>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              로그인하지 않으시겠어요?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
              >
                홈으로 돌아가기
              </button>
            </p>
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-6 text-center text-gray-400 text-xs">
          <p>🔒 안전하게 로그인되며, 귀하의 개인정보는 보호됩니다.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
