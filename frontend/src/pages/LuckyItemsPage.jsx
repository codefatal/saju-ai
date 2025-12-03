import { useState } from 'react';
import BirthForm from '../components/BirthForm';
import LuckyItemsResult from '../components/LuckyItemsResult';
import { getLuckyItems } from '../api/sajuApi';

const LuckyItemsPage = () => {
  const [items, setItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (birthData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getLuckyItems(birthData);
      setItems(result);
    } catch (err) {
      console.error('럭키 아이템 조회 실패:', err);
      setError('럭키 아이템을 불러오는데 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewItems = () => {
    setItems(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            오늘의 럭키 아이템
          </h1>
          <p className="text-lg text-gray-600">
            오늘 행운을 부르는 아이템은? AI가 추천하는 나만의 럭키 아이템
          </p>
        </div>

        {!items && !isLoading && (
          <BirthForm onSubmit={handleSubmit} submitButtonText="럭키 아이템 보기" />
        )}

        {isLoading && (
          <div className="card text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500 mb-4"></div>
            <p className="text-xl text-gray-600">럭키 아이템을 찾고 있습니다...</p>
          </div>
        )}

        {error && (
          <div className="card bg-red-50 border-red-200">
            <p className="text-red-600 text-center">{error}</p>
            <div className="text-center mt-4">
              <button onClick={handleNewItems} className="btn-secondary">
                다시 시도하기
              </button>
            </div>
          </div>
        )}

        {items && !isLoading && (
          <LuckyItemsResult items={items} onNewItems={handleNewItems} />
        )}
      </div>
    </div>
  );
};

export default LuckyItemsPage;
