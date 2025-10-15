import mongoose from 'mongoose';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      _id: mongoose.Types.ObjectId;
      id?: string;
    };
  }
}