import { useState, useEffect } from 'react';

// Custom hook for single API calls
export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err);
        console.warn('API Error:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunction]);

  return { data, loading, error };
};

// Custom hook for paginated API calls
export const usePaginatedApi = (apiFunction, page = 1, limit = 10) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchData = async (pageNum = page, limitNum = limit) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(pageNum, limitNum);
      setData(result);
      setTotalCount(result.length);
      setHasMore(result.length === limitNum);
    } catch (err) {
      setError(err);
      console.warn('Paginated API Error:', err.message);
      setData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [apiFunction, page, limit]);

  const refresh = () => {
    fetchData();
  };

  return { 
    data, 
    loading, 
    error, 
    totalCount, 
    hasMore, 
    refresh 
  };
};

// Custom hook for search functionality
export const useSearch = (searchFunction) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchFunction(searchQuery);
      setResults(searchResults);
    } catch (err) {
      console.warn('Search Error:', err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    setQuery,
    results,
    loading,
    search,
    clearSearch
  };
};
