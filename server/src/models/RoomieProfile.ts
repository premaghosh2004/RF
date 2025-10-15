import mongoose, { Schema, Document } from 'mongoose';

export interface IRoomieProfile extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  bio?: string;
  location: {
    city: string;
    state: string;
    area?: string;
  };
  preferences: {
    rentRange: { min: number; max: number };
    duration: '1-3 months' | '3-6 months' | '6-12 months' | '12+ months' | 'Flexible';
    genderPreference: 'Male' | 'Female' | 'Any';
    foodPreference: 'Vegetarian' | 'Non-Vegetarian' | 'Any';
    smokingPreference: 'Non-smoker' | 'Smoker' | 'Any';
    petPreference: 'Pet-friendly' | 'No pets' | 'Any';
    schedule: 'Early riser' | 'Night owl' | 'Flexible';
  };
  roomDetails: {
    isOffering: boolean;
    rent?: number;
    images?: string[];
    description?: string;
    amenities?: string[];
    roomType?: 'Private' | 'Shared' | 'Studio';
  };
  traits: string[];
  interests: string[];
  isActive: boolean;
  profileViews: number;
  savedBy: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RoomieProfileSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 18, max: 65 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  avatar: { 
  type: String, 
  default: function(this: IRoomieProfile) { 
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name || 'default'}`; 
  } 
},
  bio: { type: String, maxlength: 500 },
  location: {
    city: { type: String, required: true, default: 'Kolkata' },
    state: { type: String, required: true, default: 'West Bengal' },
    area: String
  },
  preferences: {
    rentRange: {
      min: { type: Number, default: 3000, min: 0 },
      max: { type: Number, default: 15000, min: 0 }
    },
    duration: { type: String, enum: ['1-3 months', '3-6 months', '6-12 months', '12+ months', 'Flexible'], default: 'Flexible' },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], default: 'Any' },
    foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Any'], default: 'Any' },
    smokingPreference: { type: String, enum: ['Non-smoker', 'Smoker', 'Any'], default: 'Non-smoker' },
    petPreference: { type: String, enum: ['Pet-friendly', 'No pets', 'Any'], default: 'Any' },
    schedule: { type: String, enum: ['Early riser', 'Night owl', 'Flexible'], default: 'Flexible' }
  },
  roomDetails: {
    isOffering: { type: Boolean, default: false },
    rent: { type: Number, min: 0 },
    images: [String],
    description: { type: String, maxlength: 1000 },
    amenities: [String],
    roomType: { type: String, enum: ['Private', 'Shared', 'Studio'] }
  },
  traits: [String],
  interests: [String],
  isActive: { type: Boolean, default: true },
  profileViews: { type: Number, default: 0 },
  savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

// Index for Kolkata-focused search
RoomieProfileSchema.index({ 'location.city': 1, 'location.state': 1, isActive: 1 });
RoomieProfileSchema.index({ 'preferences.rentRange.min': 1, 'preferences.rentRange.max': 1 });

export default mongoose.model<IRoomieProfile>('RoomieProfile', RoomieProfileSchema);
