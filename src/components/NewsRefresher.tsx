import { useEffect, useState } from 'react';

export default function NewsRefresher() {
  const [timeUntilRefresh, setTimeUntilRefresh] = useState(3600); // 1 hour in seconds
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeUntilRefresh((prev) => {
        if (prev <= 1) {
          refreshNews();
          return 3600;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const refreshNews = async () => {
    setIsRefreshing(true);
    try {
      window.location.reload();
    } catch (error) {
      console.error('Error refreshing news:', error);
    }
    setIsRefreshing(false);
  };

  const minutes = Math.floor(timeUntilRefresh / 60);
  const seconds = timeUntilRefresh % 60;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600">
          Next refresh in: {minutes}:{seconds.toString().padStart(2, '0')}
        </div>
        <button
          onClick={() => refreshNews()}
          disabled={isRefreshing}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
    </div>
  );
}