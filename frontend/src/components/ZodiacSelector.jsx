const ZodiacSelector = ({ onSelect }) => {
  const zodiacs = [
    { value: 'RAT', name: '쥐', emoji: '🐭', years: '1948, 1960, 1972, 1984, 1996, 2008, 2020' },
    { value: 'OX', name: '소', emoji: '🐮', years: '1949, 1961, 1973, 1985, 1997, 2009, 2021' },
    { value: 'TIGER', name: '호랑이', emoji: '🐯', years: '1950, 1962, 1974, 1986, 1998, 2010, 2022' },
    { value: 'RABBIT', name: '토끼', emoji: '🐰', years: '1951, 1963, 1975, 1987, 1999, 2011, 2023' },
    { value: 'DRAGON', name: '용', emoji: '🐲', years: '1952, 1964, 1976, 1988, 2000, 2012, 2024' },
    { value: 'SNAKE', name: '뱀', emoji: '🐍', years: '1953, 1965, 1977, 1989, 2001, 2013, 2025' },
    { value: 'HORSE', name: '말', emoji: '🐴', years: '1954, 1966, 1978, 1990, 2002, 2014' },
    { value: 'GOAT', name: '양', emoji: '🐑', years: '1955, 1967, 1979, 1991, 2003, 2015' },
    { value: 'MONKEY', name: '원숭이', emoji: '🐵', years: '1956, 1968, 1980, 1992, 2004, 2016' },
    { value: 'ROOSTER', name: '닭', emoji: '🐔', years: '1957, 1969, 1981, 1993, 2005, 2017' },
    { value: 'DOG', name: '개', emoji: '🐶', years: '1958, 1970, 1982, 1994, 2006, 2018' },
    { value: 'PIG', name: '돼지', emoji: '🐷', years: '1959, 1971, 1983, 1995, 2007, 2019' },
  ];

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        나의 띠를 선택하세요
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {zodiacs.map((zodiac) => (
          <button
            key={zodiac.value}
            onClick={() => onSelect(zodiac.value)}
            className="group p-6 bg-white border-2 border-gray-200 rounded-xl hover:border-primary-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <div className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">
              {zodiac.emoji}
            </div>
            <div className="text-lg font-bold text-gray-800 mb-1">
              {zodiac.name}띠
            </div>
            <div className="text-xs text-gray-500">
              {zodiac.years.split(', ').slice(0, 3).join(', ')}...
            </div>
          </button>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 text-center">
          💡 <strong>Tip:</strong> 나는 몇 띠일까? 출생년도를 12로 나눈 나머지로 확인하세요!
        </p>
      </div>
    </div>
  );
};

export default ZodiacSelector;
