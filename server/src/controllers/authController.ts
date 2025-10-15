import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: IUser;
}

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }
  
  const payload = { id: userId };
  const options = { expiresIn: process.env.JWT_EXPIRE || '7d' };
  
  // @ts-ignore - TypeScript has issues with expiresIn type but it's valid
  return jwt.sign(payload, secret, options);
};

export const register = async (req: Request, res: Response): Promise<void> => {
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

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'User with this email or username already exists',
      });
      return;
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
    });

    await user.save();

    // Generate token
    const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
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

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password') as IUser | null;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Generate token
    const token = generateToken((user._id as mongoose.Types.ObjectId).toString());

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        token,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const user = await User.findById(req.user._id)
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar') as IUser | null;

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          bio: user.bio,
          location: user.location,
          followers: user.followers,
          following: user.following,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
      return;
    }

    const { name, bio, location, phone, age, gender } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          username: name || req.user.username,
          bio: bio || req.user.bio,
          location: location || req.user.location,
          // Add other fields as needed based on your User model
        },
      },
      { new: true, runValidators: true }
    ) as IUser | null;

    if (!updatedUser) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          email: updatedUser.email,
          avatar: updatedUser.avatar,
          bio: updatedUser.bio,
          location: updatedUser.location,
          isVerified: updatedUser.isVerified,
          createdAt: updatedUser.createdAt,
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Server error updating profile',
      error: error.message,
    });
  }
};