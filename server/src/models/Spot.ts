import mongoose, { Document, Schema } from 'mongoose';

export interface ISpot extends Document {
  title: string;
  description: string;
  images: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
    address?: string;
  };
  category: string;
  tags: string[];
  user: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SpotSchema = new Schema<ISpot>({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    maxlength: 500,
  },
  images: [{
    type: String,
    required: true,
  }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(coords: number[]) {
          return coords.length === 2 && 
                 coords[0] >= -180 && coords[0] <= 180 && // longitude
                 coords[1] >= -90 && coords[1] <= 90;     // latitude
        },
        message: 'Invalid coordinates',
      },
    },
    address: {
      type: String,
      maxlength: 200,
    },
  },
  category: {
    type: String,
    required: true,
    enum: ['nature', 'urban', 'architecture', 'food', 'events', 'sports', 'art', 'other'],
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30,
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Create geospatial index for location-based queries
SpotSchema.index({ location: '2dsphere' });
SpotSchema.index({ user: 1, createdAt: -1 });
SpotSchema.index({ category: 1, createdAt: -1 });

export default mongoose.model<ISpot>('Spot', SpotSchema);
