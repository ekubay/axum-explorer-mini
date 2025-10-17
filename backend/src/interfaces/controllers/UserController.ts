// src/interfaces/controllers/UserController.ts
import { Request, Response } from 'express';
import { UserService } from '../../domain/services/UserService';

export class UserController {
  constructor(private userService: UserService) {}

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, role, phone } = req.body;

      const result = await this.userService.registerUser(
        name,
        email,
        password,
        role,
        phone
      );

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
          },
          token: result.token
        }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await this.userService.authenticateUser(email, password);

      res.json({
        success: true,
        data: {
          user: {
            id: result.user.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role
          },
          token: result.token
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : 'Authentication failed'
      });
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const user = await this.userService.getUserProfile(userId);

      res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone
          }
        }
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error instanceof Error ? error.message : 'User not found'
      });
    }
  }
}