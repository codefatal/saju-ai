import { Link } from 'react-router-dom';
import { FaStar, FaBrain, FaClock, FaShieldAlt, FaBookOpen, FaGem, FaPaw, FaGift, FaHistory, FaCalendarAlt, FaMagic, FaMoon, FaCalendarCheck, FaPen, FaDice, FaLightbulb } from 'react-icons/fa';

const HomePage = () => {
  const services = [
    // 사주운세
    {
      path: '/analysis',
      icon: <FaBookOpen className="text-5xl" />,
      title: '사주팔자 분석',
      description: '생년월일시로 나만의 사주팔자를 분석합니다',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      path: '/daily-fortune',
      icon: <FaStar className="text-5xl" />,
      title: '오늘의 운세',
      description: '오늘 하루의 운세를 확인해보세요',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      path: '/zodiac-fortune',
      icon: <FaPaw className="text-5xl" />,
      title: '띠별 운세',
      description: '12간지 띠별 운세를 알아보세요',
      gradient: 'from-green-500 to-emerald-500',
    },
    // 궁합·길일
    {
      path: '/compatibility',
      icon: <FaStar className="text-5xl" />,
      title: '궁합 분석',
      description: '두 사람의 궁합을 확인해보세요',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      path: '/lucky-day',
      icon: <FaCalendarCheck className="text-5xl" />,
      title: '길일 선택',
      description: '좋은 날을 선택하여 일을 시작하세요',
      gradient: 'from-green-600 to-emerald-600',
    },
    // 신점
    {
      path: '/tarot',
      icon: <FaMagic className="text-5xl" />,
      title: '타로 카드',
      description: '타로 카드로 질문에 대한 답을 얻어보세요',
      gradient: 'from-purple-600 to-indigo-600',
    },
    {
      path: '/dream',
      icon: <FaMoon className="text-5xl" />,
      title: '꿈 해몽',
      description: '꿈의 의미를 심리학과 전통으로 풀어드립니다',
      gradient: 'from-blue-600 to-indigo-700',
    },
    {
      path: '/tojeong',
      icon: <FaBookOpen className="text-5xl" />,
      title: '토정비결',
      description: '전통 토정비결로 연운을 확인하세요',
      gradient: 'from-amber-600 to-orange-600',
    },
    // 도구
    {
      path: '/daily-message',
      icon: <FaLightbulb className="text-5xl" />,
      title: '오늘의 한마디',
      description: '매일 바뀌는 격언과 명언으로 영감을 얻으세요',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      path: '/fortune-gacha',
      icon: <FaDice className="text-5xl" />,
      title: '운세 뽑기',
      description: '행운을 시험해보세요! 매일 새로운 운세를 뽑을 수 있습니다',
      gradient: 'from-red-500 to-pink-500',
    },
    {
      path: '/hourly-fortune',
      icon: <FaClock className="text-5xl" />,
      title: '시간대 운세',
      description: '시간대별로 알아보는 오늘의 운세',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      path: '/lucky-items',
      icon: <FaGift className="text-5xl" />,
      title: '오늘의 럭키 아이템',
      description: '행운을 부르는 오늘의 아이템',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      path: '/calendar-converter',
      icon: <FaCalendarAlt className="text-5xl" />,
      title: '음력/양력 변환',
      description: '음력과 양력을 간편하게 변환하세요',
      gradient: 'from-indigo-500 to-blue-500',
    },
    {
      path: '/name-analysis',
      icon: <FaPen className="text-5xl" />,
      title: '이름 풀이',
      description: '성명학으로 이름의 의미를 분석합니다',
      gradient: 'from-indigo-600 to-purple-600',
    },
    // 분석 이력
    {
      path: '/history',
      icon: <FaHistory className="text-5xl" />,
      title: '분석 이력',
      description: '과거 분석 결과를 다시 확인하세요',
      gradient: 'from-gray-500 to-slate-500',
    },
  ];

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
            모두의사주AI
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            AI가 분석하는 나만의 사주팔자
          </p>
        </div>
      </section>

      {/* Services Menu Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            원하는 서비스를 선택하세요
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={service.path}
                to={service.path}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative p-8 text-white">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {service.description}
                  </p>
                  <div className="mt-6 inline-flex items-center text-sm font-medium">
                    <span>시작하기</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
            왜 모두의사주AI인가요?
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
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/analysis"
              className="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              사주팔자 분석
            </Link>
            <Link
              to="/daily-fortune"
              className="inline-block bg-white text-primary-600 px-10 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
            >
              오늘의 운세
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
