import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import DailyFortunePage from './pages/DailyFortunePage';
import LuckyItemsPage from './pages/LuckyItemsPage';
import ZodiacFortunePage from './pages/ZodiacFortunePage';
import CalendarConverterPage from './pages/CalendarConverterPage';
import CompatibilityPage from './pages/CompatibilityPage';
import TarotPage from './pages/TarotPage';
import DreamPage from './pages/DreamPage';
import LuckyDayPage from './pages/LuckyDayPage';
import TojeongPage from './pages/TojeongPage';
import NameAnalysisPage from './pages/NameAnalysisPage';
import useSajuStore from './store/useSajuStore';

function App() {
  // App 초기화 시 localStorage에서 데이터 로드
  useEffect(() => {
    useSajuStore.getState().loadFromStorage();
  }, []);
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/daily-fortune" element={<DailyFortunePage />} />
            <Route path="/lucky-items" element={<LuckyItemsPage />} />
            <Route path="/zodiac-fortune" element={<ZodiacFortunePage />} />
            <Route path="/calendar-converter" element={<CalendarConverterPage />} />
            <Route path="/compatibility" element={<CompatibilityPage />} />
            <Route path="/tarot" element={<TarotPage />} />
            <Route path="/dream" element={<DreamPage />} />
            <Route path="/lucky-day" element={<LuckyDayPage />} />
            <Route path="/tojeong" element={<TojeongPage />} />
            <Route path="/name-analysis" element={<NameAnalysisPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
                  <a href="/" className="btn-primary">
                    홈으로 돌아가기
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
