// src/types/express.d.ts
import { IUser } from '../models/User';
declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}
