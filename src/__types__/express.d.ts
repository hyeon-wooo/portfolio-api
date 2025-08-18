import { TJwtPayload } from 'src/auth/auth.type';

declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
    }
  }
}
