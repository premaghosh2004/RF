import { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser & { id: string }; // extend Request to include user
    }
  }
}
