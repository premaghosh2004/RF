import { Router, Request, Response } from 'express';
import RoomieProfile from '../models/RoomieProfile';

const router = Router();

/**
 * 🏠 POST /api/profiles
 * Create a new roommate profile
 */
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      userId,
      name,
      age,
      gender,
      avatar,
      bio,
      location,
      preferences,
      roomDetails,
      traits,
      interests
    } = req.body;

    // Validate required fields
    if (!userId || !name || !age || !gender) {
      res.status(400).json({
        success: false,
        message: 'Missing required fields: userId, name, age, gender'
      });
      return;
    }

    // Create new profile with roomDetails
    const newProfile = new RoomieProfile({
      userId,
      name,
      age,
      gender,
      avatar,
      bio,
      location: location || { city: 'Kolkata', state: 'West Bengal' },
      preferences: preferences || {},
      roomDetails: roomDetails || { isOffering: false },
      traits: traits || [],
      interests: interests || [],
      profileViews: 0,
      isActive: true
    });

    const savedProfile = await newProfile.save();

    res.status(201).json({
      success: true,
      data: { profile: savedProfile },
      message: 'Profile created successfully'
    });
  } catch (error) {
    console.error('Create profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating profile'
    });
  }
});

/**
 * ✏️ PUT /api/profiles/:id
 * Update existing profile
 */
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedProfile = await RoomieProfile.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-savedBy');

    if (!updatedProfile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { profile: updatedProfile },
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

/**
 * 🏡 PATCH /api/profiles/:id/room-details
 * Update only roomDetails
 */
router.patch('/:id/room-details', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { rent, duration, location, images, description, amenities, roomType, isOffering } = req.body;

    const roomDetailsUpdate: any = {};
    if (rent !== undefined) roomDetailsUpdate['roomDetails.rent'] = parseInt(rent);
    if (duration !== undefined) roomDetailsUpdate['roomDetails.duration'] = duration;
    if (location !== undefined) roomDetailsUpdate['roomDetails.location'] = location;
    if (images !== undefined) roomDetailsUpdate['roomDetails.images'] = images;
    if (description !== undefined) roomDetailsUpdate['roomDetails.description'] = description;
    if (amenities !== undefined) roomDetailsUpdate['roomDetails.amenities'] = amenities;
    if (roomType !== undefined) roomDetailsUpdate['roomDetails.roomType'] = roomType;
    if (isOffering !== undefined) roomDetailsUpdate['roomDetails.isOffering'] = isOffering;

    const updatedProfile = await RoomieProfile.findByIdAndUpdate(
      id,
      { $set: roomDetailsUpdate },
      { new: true, runValidators: true }
    ).select('-savedBy');

    if (!updatedProfile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
      return;
    }

    res.json({
      success: true,
      data: { profile: updatedProfile },
      message: 'Room details updated successfully'
    });
  } catch (error) {
    console.error('Update room details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating room details'
    });
  }
});

/**
 * 🔍 GET /api/profiles
 * Search roommate profiles (Kolkata-focused)
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = 1,
      limit = 20,
      city = 'Kolkata',
      state,
      minRent,
      maxRent,
      gender,
      foodPreference,
      duration,
      sortBy = 'recent'
    } = req.query;

    const filter: any = { isActive: true };
    const orConditions: any[] = [];

    if (city) {
      orConditions.push(
        { 'location.city': { $regex: new RegExp(city as string, 'i') } },
        { 'location.area': { $regex: new RegExp(city as string, 'i') } }
      );
    }

    if (state) {
      filter['location.state'] = { $regex: new RegExp(state as string, 'i') };
    }

    if (minRent || maxRent) {
      if (minRent) {
        orConditions.push(
          { 'preferences.rentRange.max': { $gte: parseInt(minRent as string) } },
          { 'roomDetails.rent': { $gte: parseInt(minRent as string) } }
        );
      }
      if (maxRent) {
        orConditions.push(
          { 'preferences.rentRange.min': { $lte: parseInt(maxRent as string) } },
          { 'roomDetails.rent': { $lte: parseInt(maxRent as string) } }
        );
      }
    }

    if (gender && gender !== 'Any') {
      orConditions.push(
        { 'preferences.genderPreference': 'Any' },
        { 'preferences.genderPreference': gender },
        { gender }
      );
    }

    if (foodPreference && foodPreference !== 'Any') {
      filter['preferences.foodPreference'] = { $in: ['Any', foodPreference] };
    }

    if (duration && duration !== 'Flexible') {
      filter['preferences.duration'] = { $in: ['Flexible', duration] };
    }

    if (orConditions.length > 0) {
      filter.$or = orConditions;
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const sortOptions: Record<string, any> = {
      rent: { 'roomDetails.rent': 1, 'preferences.rentRange.min': 1 },
      age: { age: 1 },
      views: { profileViews: -1 },
      recent: { createdAt: -1 },
    };
    const sortOption = sortOptions[sortBy as string] || { createdAt: -1 };

    const profiles = await RoomieProfile.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit as string))
      .select('-savedBy')
      .lean();

    const profilesWithCompatibility = profiles.map(profile => ({
      ...profile,
      compatibility: 70 + Math.floor(Math.random() * 26),
      isSaved: false
    }));

    const total = await RoomieProfile.countDocuments(filter);
    const totalPages = Math.ceil(total / parseInt(limit as string));

    res.json({
      success: true,
      data: {
        profiles: profilesWithCompatibility,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages,
          totalResults: total,
          hasNext: parseInt(page as string) < totalPages,
          hasPrev: parseInt(page as string) > 1
        }
      }
    });
  } catch (error) {
    console.error('Get profiles error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profiles'
    });
  }
});

/**
 * 👤 GET /api/profiles/:id
 * Get specific roommate profile
 */
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const profile = await RoomieProfile.findOne({
      _id: req.params.id,
      isActive: true
    }).select('-savedBy');

    if (!profile) {
      res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
      return;
    }

    await RoomieProfile.findByIdAndUpdate(req.params.id, { $inc: { profileViews: 1 } });

    res.json({
      success: true,
      data: { profile }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

/**
 * 📍 GET /api/profiles/search/suggestions
 * Provide location suggestions for search bar
 */
router.get('/search/suggestions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, type = 'city' } = req.query;

    if (!q || (q as string).trim().length < 2) {
      res.json({
        success: true,
        data: { suggestions: ['Kolkata', 'New Town', 'Salt Lake', 'Howrah', 'Park Street'] }
      });
      return;
    }

    const suggestions =
      type === 'city'
        ? await RoomieProfile.distinct('location.city', {
            'location.city': { $regex: new RegExp(q as string, 'i') },
            isActive: true
          })
        : await RoomieProfile.distinct('location.area', {
            'location.area': { $regex: new RegExp(q as string, 'i') },
            isActive: true
          });

    res.json({
      success: true,
      data: { suggestions: suggestions.slice(0, 10) }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching suggestions'
    });
  }
});

export default router;
