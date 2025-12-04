import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaBars, FaTimes, FaChevronDown, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/', label: '홈' },
    {
      label: '사주운세',
      category: true,
      submenu: [
        { path: '/analysis', label: '사주분석' },
        { path: '/daily-fortune', label: '오늘의운세' },
        { path: '/zodiac-fortune', label: '띠별운세' },
      ],
    },
    {
      label: '궁합·길일',
      category: true,
      submenu: [
        { path: '/compatibility', label: '궁합' },
        { path: '/lucky-day', label: '길일선택' },
      ],
    },
    {
      label: '신점',
      category: true,
      submenu: [
        { path: '/tarot', label: '타로카드' },
        { path: '/dream', label: '꿈해몽' },
        { path: '/tojeong', label: '토정비결' },
      ],
    },
    {
      label: '도구',
      category: true,
      submenu: [
        { path: '/daily-message', label: '오늘의한마디' },
        { path: '/fortune-gacha', label: '운세뽑기' },
        { path: '/hourly-fortune', label: '시간대운세' },
        { path: '/daily-zodiac-compatibility', label: '띠별궁합' },
        { path: '/lucky-items', label: '럭키아이템' },
        { path: '/calendar-converter', label: '음양력변환' },
        { path: '/name-analysis', label: '이름풀이' },
      ],
    },
    { path: '/history', label: '분석이력' },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group flex-shrink-0">
            <FaStar className="text-3xl text-primary-500 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-2xl font-bold text-gradient hidden sm:inline">모두의사주AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2 items-center">
            {navItems.map((item, index) => (
              item.category ? (
                <div key={index} className="relative group">
                  <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-primary-500 hover:bg-gray-50 flex items-center gap-1">
                    {item.label}
                    <FaChevronDown size={12} />
                  </button>
                  <div className="absolute left-0 mt-0 w-40 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.path}
                        to={subitem.path}
                        className={`block px-4 py-2 text-sm first:rounded-t-md last:rounded-b-md ${
                          isActive(subitem.path)
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {/* User Authentication Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
                >
                  <FaUser size={16} />
                  <span>{user.username}</span>
                  <FaChevronDown size={12} />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                    <Link
                      to="/mypage"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-md"
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-md flex items-center gap-2"
                    >
                      <FaSignOutAlt size={14} />
                      로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors"
              >
                로그인
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t">
            {navItems.map((item, index) => (
              item.category ? (
                <div key={index}>
                  <button
                    onClick={() => toggleDropdown(index)}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                  >
                    {item.label}
                    <FaChevronDown size={14} className={`transition-transform ${openDropdown === index ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === index && (
                    <div className="bg-gray-50 ml-4">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.path}
                          to={subitem.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={`block px-3 py-2 rounded-md text-base font-medium mb-2 ${
                            isActive(subitem.path)
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:bg-white'
                          }`}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium mb-2 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              )
            ))}

            {/* Mobile User Menu */}
            <div className="border-t pt-4 mt-4">
              {user ? (
                <>
                  <Link
                    to="/mypage"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 mb-2"
                  >
                    <FaUser className="inline mr-2" />
                    마이페이지
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <FaSignOutAlt className="inline mr-2" />
                    로그아웃
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-white bg-primary-500 hover:bg-primary-600 text-center"
                >
                  로그인
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
