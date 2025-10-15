export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface LocationCoords {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
  address?: string;
}

export type SpotCategory = 'nature' | 'urban' | 'architecture' | 'food' | 'events' | 'sports' | 'art' | 'other';
