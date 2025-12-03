import { FaStar, FaCheckCircle, FaExclamationCircle, FaPalette, FaDice } from 'react-icons/fa';
import PropTypes from 'prop-types';

const NameAnalysisResult = ({ result }) => {
  const getRatingColor = (rating) => {
    switch (rating) {
      case 'EXCELLENT':
        return 'from-green-500 to-emerald-500';
      case 'GOOD':
        return 'from-blue-500 to-cyan-500';
      case 'FAIR':
        return 'from-yellow-500 to-orange-500';
      case 'POOR':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  const getRatingText = (rating) => {
    switch (rating) {
      case 'EXCELLENT':
        return '매우 좋음';
      case 'GOOD':
        return '좋음';
      case 'FAIR':
        return '보통';
      case 'POOR':
        return '주의 필요';
      default:
        return '분석 중';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 종합 점수 */}
      <div className={`card bg-gradient-to-br ${getRatingColor(result.overallRating)} text-white`}>
        <div className="text-center">
          <div className="mb-4">
            <FaStar className="text-6xl mx-auto opacity-80" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{result.name}</h2>
          <div className="text-5xl font-bold mb-2">{result.overallScore}점</div>
          <div className="text-xl opacity-90">{getRatingText(result.overallRating)}</div>
          {result.purpose && (
            <div className="mt-4 inline-block bg-white bg-opacity-20 px-4 py-2 rounded-full text-sm">
              {result.purpose === 'CURRENT' ? '현재 이름 분석' : '작명/개명 평가'}
            </div>
          )}
        </div>
      </div>

      {/* 이름 구성 */}
      {result.characters && result.characters.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">이름 구성</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.characters.map((char, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-indigo-700 mb-2 text-center">{char.character}</div>
                <div className="space-y-1 text-sm">
                  <div className="text-gray-700">
                    <span className="font-medium">의미:</span> {char.meaning}
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">발음:</span> {char.pronunciation}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      <span className="font-medium">획수:</span> {char.strokes}획
                    </span>
                    <span className="font-medium text-indigo-600">{char.element}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 획수 분석 */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">획수 분석 (오격)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {result.totalStrokes && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-sm text-gray-600 mb-1">총획</div>
              <div className="text-2xl font-bold text-gray-800">{result.totalStrokes}획</div>
            </div>
          )}
          {result.heavenStrokes && (
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-sm text-blue-600 mb-1">천격</div>
              <div className="text-2xl font-bold text-blue-700">{result.heavenStrokes}획</div>
              {result.heavenElement && <div className="text-xs text-blue-600 mt-1">{result.heavenElement}</div>}
            </div>
          )}
          {result.earthStrokes && (
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-sm text-green-600 mb-1">지격</div>
              <div className="text-2xl font-bold text-green-700">{result.earthStrokes}획</div>
              {result.earthElement && <div className="text-xs text-green-600 mt-1">{result.earthElement}</div>}
            </div>
          )}
          {result.personalityStrokes && (
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-sm text-purple-600 mb-1">인격</div>
              <div className="text-2xl font-bold text-purple-700">{result.personalityStrokes}획</div>
              {result.personalityElement && <div className="text-xs text-purple-600 mt-1">{result.personalityElement}</div>}
            </div>
          )}
          {result.outerStrokes && (
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-sm text-yellow-600 mb-1">외격</div>
              <div className="text-2xl font-bold text-yellow-700">{result.outerStrokes}획</div>
            </div>
          )}
          {result.totalStrokesForte && (
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-sm text-red-600 mb-1">총격</div>
              <div className="text-2xl font-bold text-red-700">{result.totalStrokesForte}획</div>
            </div>
          )}
        </div>
        {result.elementBalance && (
          <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
            <div className="text-sm font-medium text-indigo-700 mb-1">오행 균형</div>
            <div className="text-gray-700">{result.elementBalance}</div>
          </div>
        )}
      </div>

      {/* 이름의 의미 */}
      {result.nameMeaning && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">이름의 의미</h3>
          <p className="text-gray-700 leading-relaxed">{result.nameMeaning}</p>
        </div>
      )}

      {/* 성격 분석 */}
      {result.personalityAnalysis && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">성격 분석</h3>
          <p className="text-gray-700 leading-relaxed">{result.personalityAnalysis}</p>
        </div>
      )}

      {/* 운세 분석 */}
      {result.fortuneAnalysis && (
        <div className="card">
          <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">운세 분석</h3>
          <p className="text-gray-700 leading-relaxed">{result.fortuneAnalysis}</p>
        </div>
      )}

      {/* 사주와의 궁합 */}
      {result.compatibility && (
        <div className="card bg-purple-50">
          <h3 className="text-xl font-bold text-purple-800 mb-4 border-b border-purple-200 pb-2">
            사주와의 궁합
          </h3>
          <p className="text-gray-700 leading-relaxed">{result.compatibility}</p>
        </div>
      )}

      {/* 강점과 약점 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 강점 */}
        {result.strengths && result.strengths.length > 0 && (
          <div className="card bg-green-50">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
              <FaCheckCircle className="mr-2" />
              강점
            </h3>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span className="text-gray-700">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 약점 */}
        {result.weaknesses && result.weaknesses.length > 0 && (
          <div className="card bg-yellow-50">
            <h3 className="text-lg font-bold text-yellow-800 mb-3 flex items-center">
              <FaExclamationCircle className="mr-2" />
              약점 및 주의사항
            </h3>
            <ul className="space-y-2">
              {result.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-yellow-600 mr-2">!</span>
                  <span className="text-gray-700">{weakness}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 조언 */}
      {result.advice && (
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-indigo-500">
          <h3 className="text-xl font-bold text-indigo-800 mb-3">조언</h3>
          <p className="text-gray-700 leading-relaxed">{result.advice}</p>
        </div>
      )}

      {/* 럭키 아이템 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 행운의 색상 */}
        {result.luckyColors && result.luckyColors.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <FaPalette className="mr-2 text-pink-500" />
              행운의 색상
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.luckyColors.map((color, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 행운의 숫자 */}
        {result.luckyNumbers && result.luckyNumbers.length > 0 && (
          <div className="card">
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
              <FaDice className="mr-2 text-blue-500" />
              행운의 숫자
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.luckyNumbers.map((number, index) => (
                <span
                  key={index}
                  className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-500 text-white rounded-full text-lg font-bold"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

NameAnalysisResult.propTypes = {
  result: PropTypes.shape({
    name: PropTypes.string.isRequired,
    purpose: PropTypes.string,
    overallScore: PropTypes.number,
    overallRating: PropTypes.string,
    characters: PropTypes.arrayOf(
      PropTypes.shape({
        character: PropTypes.string,
        meaning: PropTypes.string,
        strokes: PropTypes.number,
        pronunciation: PropTypes.string,
        element: PropTypes.string,
      })
    ),
    totalStrokes: PropTypes.number,
    heavenStrokes: PropTypes.number,
    earthStrokes: PropTypes.number,
    personalityStrokes: PropTypes.number,
    outerStrokes: PropTypes.number,
    totalStrokesForte: PropTypes.number,
    heavenElement: PropTypes.string,
    earthElement: PropTypes.string,
    personalityElement: PropTypes.string,
    elementBalance: PropTypes.string,
    nameMeaning: PropTypes.string,
    personalityAnalysis: PropTypes.string,
    fortuneAnalysis: PropTypes.string,
    compatibility: PropTypes.string,
    strengths: PropTypes.arrayOf(PropTypes.string),
    weaknesses: PropTypes.arrayOf(PropTypes.string),
    advice: PropTypes.string,
    luckyColors: PropTypes.arrayOf(PropTypes.string),
    luckyNumbers: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default NameAnalysisResult;
