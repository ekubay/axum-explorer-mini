// src/interfaces/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../application/config';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export class AuthMiddleware {
  static authenticate(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
  }

  static authorize(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Access denied. No user information.'
        });
        return;
      }

      if (!roles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
        return;
      }

      next();
    };
  }

  static optionalAuth(req: AuthRequest, res: Response, next: NextFunction): void {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        const decoded = jwt.verify(token, config.auth.jwtSecret) as any;
        req.user = {
          id: decoded.id,
          email: decoded.email,
          role: decoded.role
        };
      } catch (error) {
        // Token is invalid, but we continue without user info
        console.warn('Invalid token in optional auth');
      }
    }

    next();
  }
}