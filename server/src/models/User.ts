import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  bio?: string;
  location?: string;
  roomPhotos?: string[];
  
  // Add all the profile fields
  age?: number;
  phone?: string;
  gender?: string;
  rent?: number;
  duration?: number;
  roomPhoto?: string;
  
  // Roommate preferences
  foodPref?: string;
  smoking?: boolean;
  pets?: boolean;
  cleanliness?: string;
  sleepSchedule?: string;
  
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false,
  },
  avatar: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  location: {
    type: String,
    maxlength: 100,
  },
  
  // Add all profile fields
  age: {
    type: Number,
    min: 18,
    max: 100,
  },
  phone: {
    type: String,
    maxlength: 20,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  rent: {
    type: Number,
    min: 0,
  },
  duration: {
    type: Number,
    min: 1,
  },
  roomPhotos: [{
    type: String,
  }],
  
  // Roommate preferences
  foodPref: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'any'],
    default: 'any',
  },
  smoking: {
    type: Boolean,
    default: false,
  },
  pets: {
    type: Boolean,
    default: false,
  },
  cleanliness: {
    type: String,
    enum: ['very-high', 'high', 'moderate', 'relaxed'],
    default: 'moderate',
  },
  sleepSchedule: {
    type: String,
    enum: ['early', 'regular', 'late', 'flexible'],
    default: 'flexible',
  },
  
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  isVerified: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);

