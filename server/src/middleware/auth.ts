import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User, IUser } from '../models/User.js';
import { AppError } from './errorHandler.js';

export type AuthRequest = Request & {
  user?: IUser;
  userId?: string;
};

export async function authenticate(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token =
    header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;

  if (!token) throw new AppError(401, 'Authentication required', 'AUTH_REQUIRED');

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { sub: string };
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid session', 'INVALID_SESSION');
    }
    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch {
    throw new AppError(401, 'Invalid or expired token', 'INVALID_TOKEN');
  }
}

export function authorize(...roles: string[]) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) throw new AppError(401, 'Authentication required');
    if (!roles.includes(req.user.role)) {
      throw new AppError(403, 'Insufficient permissions', 'FORBIDDEN');
    }
    next();
  };
}

export function optionalAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  const token =
    header?.startsWith('Bearer ') ? header.slice(7) : req.cookies?.accessToken;
  if (!token) return next();
  jwt.verify(token, env.jwtSecret, async (err, payload) => {
    if (!err && payload && typeof payload === 'object' && 'sub' in payload) {
      const user = await User.findById(payload.sub as string).select('-passwordHash');
      if (user?.isActive) {
        req.user = user;
        req.userId = user._id.toString();
      }
    }
    next();
  });
}
