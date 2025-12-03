import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import { FaSpinner } from 'react-icons/fa';

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback, handleKakaoCallback, error } = useAuthStore();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');

        if (!code) {
          setLocalError('인증 코드를 찾을 수 없습니다.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        if (state === 'google') {
          await handleGoogleCallback(code);
          // Redirect to home or profile completion page
          setTimeout(() => {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.hasProfile) {
              navigate('/');
            } else {
              navigate('/mypage');
            }
          }, 1000);
        } else if (state === 'kakao') {
          await handleKakaoCallback(code);
          // Redirect to home or profile completion page
          setTimeout(() => {
            const userData = JSON.parse(localStorage.getItem('user') || '{}');
            if (userData.hasProfile) {
              navigate('/');
            } else {
              navigate('/mypage');
            }
          }, 1000);
        } else {
          setLocalError('알 수 없는 인증 제공자입니다.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        setLocalError(
          err.message || '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
        );
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, handleGoogleCallback, handleKakaoCallback]);

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-black px-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-2xl p-8 text-center">
          {displayError ? (
            <>
              {/* Error State */}
              <div className="mb-6">
                <div className="text-6xl text-red-500 mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  로그인 실패
                </h2>
                <div className="bg-red-900 bg-opacity-30 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
                  {displayError}
                </div>
                <p className="text-gray-400 text-sm mb-6">
                  3초 후 로그인 페이지로 돌아갑니다...
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Loading State */}
              <div className="mb-6">
                <div className="text-6xl mb-4 flex justify-center">
                  <FaSpinner className="animate-spin text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">
                  로그인 중입니다
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  잠깐만 기다려주세요...
                </p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-600 h-full w-full animate-pulse"></div>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="text-gray-400 text-xs mt-6">
            <p>🔒 안전한 인증 프로세스 진행 중</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthCallbackPage;
