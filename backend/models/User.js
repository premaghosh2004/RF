const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false },
  name: { type: String, required: true, trim: true, maxlength: 50 },
  age: { type: Number, required: true, min: 18, max: 65 },
  gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
  phone: { type: String, trim: true },
  avatar: { type: String, default: function () { return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.name}`; } },
  bio: { type: String, maxlength: 500 },
  location: {
    city: { type: String, required: true },
    state: { type: String, required: true },
    area: String,
    coordinates: { lat: Number, lng: Number }
  },
  preferences: {
    rentRange: { min: { type: Number, default: 300 }, max: { type: Number, default: 2000 } },
    duration: { type: String, enum: ['1-3 months', '3-6 months', '6-12 months', '12+ months', 'Flexible'], default: 'Flexible' },
    genderPreference: { type: String, enum: ['Male', 'Female', 'Any'], default: 'Any' },
    foodPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Any'], default: 'Any' },
    smokingPreference: { type: String, enum: ['Non-smoker', 'Smoker', 'Any'], default: 'Non-smoker' },
    petPreference: { type: String, enum: ['Pet-friendly', 'No pets', 'Any'], default: 'Any' },
    schedule: { type: String, enum: ['Early riser', 'Night owl', 'Flexible'], default: 'Flexible' }
  },
  roomDetails: {
    isOffering: { type: Boolean, default: false },
    rent: { type: Number },
    images: [String],
    description: { type: String, maxlength: 1000 },
    amenities: [String],
    availableFrom: { type: Date },
    roomType: { type: String, enum: ['Private', 'Shared', 'Studio'] }
  },
  traits: [String],
  interests: [String],
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  savedProfiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  profileViews: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ 'location.city': 1, 'location.state': 1 });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidatePassword) { return bcrypt.compare(candidatePassword, this.password); };

userSchema.methods.calculateCompatibility = function (otherUser) {
  let score = 0, factors = 0;
  if (this.location.city === otherUser.location?.city) score += 30; else if (this.location.state === otherUser.location?.state) score += 15; factors += 30;
  const rentA = this.preferences?.rentRange, rentB = otherUser.roomDetails?.rent ? { min: otherUser.roomDetails.rent, max: otherUser.roomDetails.rent } : otherUser.preferences?.rentRange;
  if (rentA && rentB) { const overlap = Math.max(0, Math.min(rentA.max, rentB.max) - Math.max(rentA.min, rentB.min)); if (overlap > 0) score += 25; } factors += 25;
  if (!this.preferences || !otherUser.preferences) return Math.round((score / factors) * 100);
  if (this.preferences.foodPreference === otherUser.preferences.foodPreference || this.preferences.foodPreference === 'Any' || otherUser.preferences.foodPreference === 'Any') score += 15; factors += 15;
  if (this.preferences.smokingPreference === otherUser.preferences.smokingPreference || this.preferences.smokingPreference === 'Any' || otherUser.preferences.smokingPreference === 'Any') score += 15; factors += 15;
  if (this.preferences.petPreference === otherUser.preferences.petPreference || this.preferences.petPreference === 'Any' || otherUser.preferences.petPreference === 'Any') score += 10; factors += 10;
  if (this.preferences.schedule === otherUser.preferences.schedule || this.preferences.schedule === 'Flexible' || otherUser.preferences.schedule === 'Flexible') score += 5; factors += 5;
  return Math.round((score / factors) * 100);
};

userSchema.methods.getPublicProfile = function () { const user = this.toObject(); delete user.password; delete user.email; delete user.phone; return user; };

module.exports = mongoose.model('User', userSchema);
