import { FaGithub, FaTwitter, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">모두의사주AI</h3>
            <p className="text-gray-600 text-sm">
              AI 기술을 활용한 전통 사주 분석 서비스
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">링크</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  이용약관
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-500 transition-colors">
                  개인정보처리방침
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">소셜 미디어</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary-500 transition-colors"
                aria-label="Email"
              >
                <FaEnvelope size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; {currentYear} 모두의사주AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
