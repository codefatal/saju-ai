import { Link } from 'react-router-dom';
import { FaStar, FaBrain, FaClock, FaShieldAlt } from 'react-icons/fa';

const HomePage = () => {
  const features = [
    {
      icon: <FaBrain className="text-4xl text-primary-500" />,
      title: 'AI 기반 분석',
      description: '최신 AI 기술로 정확하고 상세한 사주 분석을 제공합니다',
    },
    {
      icon: <FaClock className="text-4xl text-secondary-500" />,
      title: '빠른 결과',
      description: '몇 초 만에 전문가 수준의 사주 분석 결과를 확인하세요',
    },
    {
      icon: <FaShieldAlt className="text-4xl text-accent-500" />,
      title: '개인정보 보호',
      description: '안전하게 암호화된 시스템으로 정보를 보호합니다',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <FaStar className="text-6xl text-primary-500 mx-auto mb-6 animate-pulse" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gradient mb-6 animate-slide-up">
            SajuAI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI가 분석하는 나만의 사주팔자
          </p>
          <Link
            to="/analysis"
            className="inline-block btn-primary text-xl px-12 py-4 animate-slide-up"
            style={{ animationDelay: '0.4s' }}
          >
            지금 분석하기
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            왜 SajuAI인가요?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card text-center hover:scale-105 transition-transform duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            사용 방법
          </h2>
          <div className="space-y-8">
            {[
              { step: '1', title: '생년월일 입력', description: '정확한 생년월일시를 입력해주세요' },
              { step: '2', title: 'AI 분석', description: 'AI가 사주팔자를 계산하고 분석합니다' },
              { step: '3', title: '결과 확인', description: '상세한 분석 결과를 확인하세요' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start space-x-6 card"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-500 to-secondary-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8">
            나의 운명을 알아보고 더 나은 미래를 준비하세요
          </p>
          <Link
            to="/analysis"
            className="inline-block bg-white text-primary-600 px-12 py-4 rounded-lg font-bold text-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            무료로 분석하기
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
