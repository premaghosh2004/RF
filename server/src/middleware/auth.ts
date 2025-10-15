import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';

interface DecodedToken extends JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'No token provided or invalid format',
      });
      return;
    }

    token = token.slice(7); // Remove 'Bearer ' prefix

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({
        success: false,
        message: 'Server configuration error',
      });
      return;
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    const user = await User.findById(decoded.id).select('-password') as IUser | null;
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token - user not found',
      });
      return;
    }

    req.user = {
      _id: user._id as mongoose.Types.ObjectId,
      id: user._id.toString(),
    };
    
    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message,
    });
  }
};

export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token = req.header('Authorization');

    if (!token || !token.startsWith('Bearer ')) {
      return next();
    }

    token = token.slice(7);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return next();
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;
    const user = await User.findById(decoded.id).select('-password') as IUser | null;
    
    if (user) {
      req.user = {
        _id: user._id as mongoose.Types.ObjectId,
      };
    }

    next();
  } catch (error) {
    // If token is invalid, just continue without user
    next();
  }
};