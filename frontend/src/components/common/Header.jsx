import { Link, useLocation } from 'react-router-dom';
import { FaStar, FaBars, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: '홈' },
    { path: '/analysis', label: '사주분석' },
    { path: '/compatibility', label: '궁합' },
    { path: '/daily-fortune', label: '오늘의운세' },
    { path: '/zodiac-fortune', label: '띠별운세' },
    { path: '/lucky-items', label: '럭키아이템' },
    { path: '/calendar-converter', label: '음양력변환' },
    { path: '/history', label: '분석이력' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <FaStar className="text-3xl text-primary-500 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-2xl font-bold text-gradient">모두의사주AI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
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
            ))}
          </nav>

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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium mb-2 ${
                  isActive(item.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-700 hover:text-primary-500 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
