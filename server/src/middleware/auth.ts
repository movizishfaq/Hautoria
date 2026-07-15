import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User, IUser, UserRole } from '../models/User.js';
import { AppError } from './errorHandler.js';

export type AuthRequest = Request & {
  user?: IUser;
  userId?: string;
};

type AccessTokenPayload = {
  sub: string;
  role?: UserRole;
  email?: string;
  name?: string;
  isActive?: boolean;
};

function userFromClaims(payload: AccessTokenPayload): IUser {
  return {
    _id: payload.sub,
    id: payload.sub,
    role: payload.role!,
    email: payload.email ?? '',
    name: payload.name ?? '',
    isActive: payload.isActive !== false,
  } as unknown as IUser;
}

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
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
    if (!payload.sub) throw new AppError(401, 'Invalid session', 'INVALID_SESSION');

    // Fast path: role embedded in JWT — no Mongo round-trip on every admin/API call.
    if (payload.role && payload.isActive !== false) {
      req.user = userFromClaims(payload);
      req.userId = payload.sub;
      return next();
    }

    // Legacy tokens (sub only) — hydrate once from DB.
    const user = await User.findById(payload.sub).select('-passwordHash');
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid session', 'INVALID_SESSION');
    }
    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (err) {
    if (err instanceof AppError) throw err;
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

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;
    if (payload.role && payload.isActive !== false) {
      req.user = userFromClaims(payload);
      req.userId = payload.sub;
      return next();
    }
    void User.findById(payload.sub)
      .select('-passwordHash')
      .then((user) => {
        if (user?.isActive) {
          req.user = user;
          req.userId = user._id.toString();
        }
        next();
      })
      .catch(() => next());
  } catch {
    next();
  }
}
