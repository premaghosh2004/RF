export type Gender = 'Male' | 'Female' | 'Other';
export type FoodPreference = 'Vegetarian' | 'Non-Vegetarian' | 'Any';
export type DurationPref = '1-3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Flexible';

export interface Location {
  city: string;
  state: string;
  area?: string;
  coordinates?: { lat: number; lng: number };
}

export interface RentRange { min: number; max: number; }

export interface Preferences {
  rentRange: RentRange;
  duration: DurationPref;
  genderPreference: 'Male' | 'Female' | 'Any';
  foodPreference: FoodPreference;
  smokingPreference: 'Non-smoker' | 'Smoker' | 'Any';
  petPreference: 'Pet-friendly' | 'No pets' | 'Any';
  schedule: 'Early riser' | 'Night owl' | 'Flexible';
}

export interface RoomDetails {
  isOffering: boolean;
  rent?: number;
  images?: string[];
  description?: string;
  amenities?: string[];
  availableFrom?: string;
  roomType?: 'Private' | 'Shared' | 'Studio';
}

export interface PublicUserProfile {
  _id: string;
  name: string;
  age: number;
  gender: Gender;
  avatar: string;
  bio?: string;
  location: Location;
  preferences: Preferences;
  roomDetails?: RoomDetails;
  traits?: string[];
  interests?: string[];
  isActive: boolean;
  isVerified: boolean;
  profileViews: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
  compatibility?: number | null;
  isSaved?: boolean;
}

export interface Paginated<T> {
  data: T[];
  pagination: { currentPage: number; totalPages: number; totalResults: number; hasNext: boolean; hasPrev: boolean; };
}
