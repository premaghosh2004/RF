import { useEffect, useMemo, useState } from 'react';
import { profilesAPI } from '@/lib/api'; // Use your existing API
import type { PublicUserProfile } from '@/types/profile';

export interface ProfilesQuery {
  page?: number;
  limit?: number;
  city?: string;
  state?: string;
  minRent?: number;
  maxRent?: number;
  gender?: 'Male' | 'Female' | 'Any';
  foodPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Any';
  duration?: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Flexible';
  sortBy?: 'compatibility' | 'rent' | 'age' | 'recent';
}

export const useProfiles = (initialParams: ProfilesQuery = {}) => {
  const [params, setParams] = useState<ProfilesQuery>({ 
    page: 1, 
    limit: 12, 
    city: 'Kolkata', // Default to Kolkata
    sortBy: 'recent',
    ...initialParams 
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchProfiles = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Filter out undefined values
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
      );
      
      const { data } = await profilesAPI.getProfiles(cleanParams);
      const list = data?.data?.profiles || [];
      const pagination = data?.data?.pagination;
      
      setProfiles(list);
      if (pagination) {
        setTotal(pagination.totalResults || 0);
        setTotalPages(pagination.totalPages || 0);
      }
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to load profiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [params]); // Watch params directly instead of queryString

  return {
    profiles,
    loading,
    error,
    total,
    totalPages,
    params,
    setParams,
    refresh: fetchProfiles
  };
};
