import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
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
          age: user.age,
          phone: user.phone,
          gender: user.gender,
          rent: user.rent,
          duration: user.duration,
          roomPhoto: user.roomPhoto,
          foodPref: user.foodPref,
          smoking: user.smoking,
          pets: user.pets,
          cleanliness: user.cleanliness,
          sleepSchedule: user.sleepSchedule,
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
          age: user.age,
          phone: user.phone,
          gender: user.gender,
          rent: user.rent,
          duration: user.duration,
          roomPhoto: user.roomPhoto,
          foodPref: user.foodPref,
          smoking: user.smoking,
          pets: user.pets,
          cleanliness: user.cleanliness,
          sleepSchedule: user.sleepSchedule,
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
          age: user.age,
          phone: user.phone,
          gender: user.gender,
          rent: user.rent,
          duration: user.duration,
          roomPhoto: user.roomPhoto,
          foodPref: user.foodPref,
          smoking: user.smoking,
          pets: user.pets,
          cleanliness: user.cleanliness,
          sleepSchedule: user.sleepSchedule,
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

    const { 
      name, bio, location, phone, age, gender, 
      rent, duration, foodPref, smoking, pets, 
      cleanliness, sleepSchedule, avatar, roomPhoto 
    } = req.body;

    const updateData: any = {};
    
    // Only update fields that are provided
    if (name !== undefined) updateData.username = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (phone !== undefined) updateData.phone = phone;
    if (age !== undefined) updateData.age = Number(age);
    if (gender !== undefined) updateData.gender = gender;
    if (rent !== undefined) updateData.rent = Number(rent);
    if (duration !== undefined) updateData.duration = Number(duration);
    if (foodPref !== undefined) updateData.foodPref = foodPref;
    if (smoking !== undefined) updateData.smoking = smoking;
    if (pets !== undefined) updateData.pets = pets;
    if (cleanliness !== undefined) updateData.cleanliness = cleanliness;
    if (sleepSchedule !== undefined) updateData.sleepSchedule = sleepSchedule;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (roomPhoto !== undefined) updateData.roomPhoto = roomPhoto;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
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
          age: updatedUser.age,
          phone: updatedUser.phone,
          gender: updatedUser.gender,
          rent: updatedUser.rent,
          duration: updatedUser.duration,
          roomPhoto: updatedUser.roomPhoto,
          foodPref: updatedUser.foodPref,
          smoking: updatedUser.smoking,
          pets: updatedUser.pets,
          cleanliness: updatedUser.cleanliness,
          sleepSchedule: updatedUser.sleepSchedule,
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
