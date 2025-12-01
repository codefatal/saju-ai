import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="card max-w-md mx-auto bg-red-50 border-2 border-red-200">
      <div className="flex flex-col items-center text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">오류가 발생했습니다</h3>
        <p className="text-red-600 mb-6">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary">
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
