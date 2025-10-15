import { Request, Response } from 'express';
import Spot, { ISpot } from '../models/Spot';
import Comment from '../models/Comment';
import { validationResult } from 'express-validator';

export const createSpot = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
      return;
    }

    const { title, description, location, category, tags, isPublic } = req.body;
    const images = req.body.images || [];

    const spot = new Spot({
      title,
      description,
      images,
      location,
      category,
      tags: tags || [],
      user: req.user?.id,
      isPublic: isPublic !== false,
    });

    await spot.save();
    
    const populatedSpot = await Spot.findById(spot._id)
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
      });

    res.status(201).json({
      success: true,
      message: 'Spot created successfully',
      data: { spot: populatedSpot },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error creating spot',
      error: error.message,
    });
  }
};

export const getSpots = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const search = req.query.search as string;
    const latitude = parseFloat(req.query.lat as string);
    const longitude = parseFloat(req.query.lng as string);
    const radius = parseFloat(req.query.radius as string) || 10; // km

    const skip = (page - 1) * limit;

    // Build query
    let query: any = { isPublic: true };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Geospatial query if location provided
    if (!isNaN(latitude) && !isNaN(longitude)) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const spots = await Spot.find(query)
      .populate('user', 'username avatar')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { limit: 3, sort: { createdAt: -1 } },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Spot.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        spots,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching spots',
      error: error.message,
    });
  }
};

export const getSpotById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const spot = await Spot.findById(id)
      .populate('user', 'username avatar bio location')
      .populate('likes', 'username avatar')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username avatar',
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!spot) {
      res.status(404).json({
        success: false,
        message: 'Spot not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: { spot },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching spot',
      error: error.message,
    });
  }
};

export const toggleLike = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const spot = await Spot.findById(id);
    if (!spot) {
      res.status(404).json({
        success: false,
        message: 'Spot not found',
      });
      return;
    }

    const isLiked = spot.likes.includes(userId as any);

    if (isLiked) {
      spot.likes = spot.likes.filter(like => like.toString() !== userId);
    } else {
      spot.likes.push(userId as any);
    }

    await spot.save();

    res.status(200).json({
      success: true,
      message: isLiked ? 'Like removed' : 'Spot liked',
      data: {
        isLiked: !isLiked,
        likesCount: spot.likes.length,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error toggling like',
      error: error.message,
    });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { content, parentComment } = req.body;
    const userId = req.user?.id;

    const spot = await Spot.findById(id);
    if (!spot) {
      res.status(404).json({
        success: false,
        message: 'Spot not found',
      });
      return;
    }

    const comment = new Comment({
      content,
      user: userId,
      spot: id,
      parentComment: parentComment || undefined,
    });

    await comment.save();

    spot.comments.push(comment._id as any);
    await spot.save();

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'username avatar');

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment: populatedComment },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error adding comment',
      error: error.message,
    });
  }
};
