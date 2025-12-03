import { useState } from 'react';
import CalendarConverter from '../components/CalendarConverter';
import CalendarConversionResult from '../components/CalendarConversionResult';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import { convertCalendar } from '../api/sajuApi';

const CalendarConverterPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConvert = async (calendarData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await convertCalendar(calendarData);
      setResult(response);
    } catch (err) {
      console.error('Calendar conversion error:', err);
      setError(err.message || '날짜 변환에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversion = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {loading ? (
          <Loading message="날짜 변환 중..." />
        ) : result ? (
          <CalendarConversionResult result={result} onNewConversion={handleNewConversion} />
        ) : (
          <CalendarConverter onConvert={handleConvert} />
        )}
      </div>
    </div>
  );
};

export default CalendarConverterPage;
