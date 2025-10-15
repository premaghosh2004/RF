import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { PublicUserProfile } from '@/types/profile';

export interface ProfilesQuery {
  page?: number; limit?: number; city?: string; state?: string; minRent?: number; maxRent?: number;
  gender?: 'Male' | 'Female' | 'Any'; foodPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Any';
  duration?: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Flexible'; sortBy?: 'compatibility' | 'rent' | 'age' | 'recent';
}

export const useProfiles = (initialParams: ProfilesQuery = {}) => {
  const [params, setParams] = useState<ProfilesQuery>({ page: 1, limit: 12, sortBy: 'compatibility', ...initialParams });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<PublicUserProfile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const queryString = useMemo(() => {
    const url = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') url.append(k, String(v)); });
    return url.toString();
  }, [params]);

  const fetchProfiles = async () => {
    setLoading(true); setError(null);
    try {
      const { data } = await api.get(`/profiles?${queryString}`);
      const list = (data?.data?.profiles ?? []) as PublicUserProfile[];
      const p = data?.data?.pagination;
      setProfiles(list);
      if (p) { setTotal(p.totalResults ?? 0); setTotalPages(p.totalPages ?? 0); }
    } catch (e: any) { setError(e?.response?.data?.message || 'Failed to load profiles'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProfiles(); /* eslint-disable-next-line */ }, [queryString]);

  return { profiles, loading, error, total, totalPages, params, setParams, refresh: fetchProfiles };
};
