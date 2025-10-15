import { Router, Request, Response } from 'express';
import RoomieProfile from '../models/RoomieProfile';

const router = Router();

// GET /api/profiles - Search roommate profiles (Kolkata-focused)
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
    
    if (city) {
      filter['location.city'] = { $regex: new RegExp(city as string, 'i') };
    }
    if (state) {
      filter['location.state'] = { $regex: new RegExp(state as string, 'i') };
    }

    if (minRent || maxRent) {
      const rentConditions: any[] = [];
      
      if (minRent) {
        rentConditions.push(
          { 'preferences.rentRange.max': { $gte: parseInt(minRent as string) } },
          { 'roomDetails.rent': { $gte: parseInt(minRent as string) } }
        );
      }
      if (maxRent) {
        rentConditions.push(
          { 'preferences.rentRange.min': { $lte: parseInt(maxRent as string) } },
          { 'roomDetails.rent': { $lte: parseInt(maxRent as string) } }
        );
      }
      
      if (rentConditions.length > 0) {
        filter.$or = rentConditions;
      }
    }

    if (gender && gender !== 'Any') {
      filter.$or = [
        { 'preferences.genderPreference': 'Any' },
        { 'preferences.genderPreference': gender },
        { gender: gender }
      ];
    }

    if (foodPreference && foodPreference !== 'Any') {
      filter['preferences.foodPreference'] = { $in: ['Any', foodPreference] };
    }

    if (duration && duration !== 'Flexible') {
      filter['preferences.duration'] = { $in: ['Flexible', duration] };
    }

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    let sortOption: any = { createdAt: -1 };
    switch (sortBy) {
      case 'rent':
        sortOption = { 'roomDetails.rent': 1, 'preferences.rentRange.min': 1 };
        break;
      case 'age':
        sortOption = { age: 1 };
        break;
      case 'views':
        sortOption = { profileViews: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const profiles = await RoomieProfile.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit as string))
      .select('-savedBy')
      .lean();

    const profilesWithCompatibility = profiles.map(profile => ({
      ...profile,
      compatibility: Math.floor(Math.random() * (95 - 70) + 70),
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

// GET /api/profiles/:id - Get specific profile
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

// GET /api/profiles/search/suggestions - Location suggestions
router.get('/search/suggestions', async (req: Request, res: Response): Promise<void> => {
  try {
    const { q, type = 'city' } = req.query;
    
    if (!q || (q as string).length < 2) {
      res.json({
        success: true,
        data: { suggestions: ['Kolkata', 'New Town', 'Salt Lake', 'Howrah', 'Park Street'] }
      });
      return;
    }

    const suggestions = type === 'city' 
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
