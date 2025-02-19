import { useState, useCallback } from 'react';

interface CacheData<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  expirationTime?: number; // milliseconds
}

export function useDataCache<T>(config: CacheConfig = {}) {
  const { expirationTime = 5 * 60 * 1000 } = config; // 5 minutes
  const [cache] = useState<Map<string, CacheData<T>>>(new Map());

  const getCachedData = useCallback((key: string): T | null => {
    const cachedData = cache.get(key);
    if (!cachedData) return null;

    const isExpired = Date.now() - cachedData.timestamp > expirationTime;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return cachedData.data;
  }, [cache, expirationTime]);

  const setCachedData = useCallback((key: string, data: T) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }, [cache]);

  const clearCache = useCallback(() => {
    cache.clear();
  }, [cache]);

  return {
    getCachedData,
    setCachedData,
    clearCache
  };
}