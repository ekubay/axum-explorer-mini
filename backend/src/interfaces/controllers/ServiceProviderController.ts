// src/interfaces/controllers/ServiceProviderController.ts
import { Request, Response } from 'express';
import { ServiceProviderService } from '../../domain/services/ServiceProviderService';
import { AuthRequest } from '../middleware/auth';

export class ServiceProviderController {
  constructor(
    private providerService: ServiceProviderService
  ) {}

  async register(req: AuthRequest, res: Response): Promise<void> {
    try {
      const {
        businessName,
        description,
        type,
        contactInfo,
        location
      } = req.body;

      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const provider = await this.providerService.registerProvider(
        userId,
        businessName,
        description,
        type,
        contactInfo,
        location
      );

      res.status(201).json({
        success: true,
        data: { provider }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Provider registration failed'
      });
    }
  }

  async listProviders(req: Request, res: Response): Promise<void> {
    try {
      const { type, verified } = req.query;

      const providers = await this.providerService.listProviders(
        type as any,
        verified !== 'false'
      );

      res.json({
        success: true,
        data: { providers }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch providers'
      });
    }
  }

  async getProviderById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const provider = await this.providerService.getProviderById(id);

      if (!provider) {
        res.status(404).json({
          success: false,
          message: 'Provider not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { provider }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch provider'
      });
    }
  }

  async getMyProviderProfile(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User authentication required'
        });
        return;
      }

      const provider = await this.providerService.getProviderByUserId(userId);

      if (!provider) {
        res.status(404).json({
          success: false,
          message: 'Provider profile not found'
        });
        return;
      }

      res.json({
        success: true,
        data: { provider }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch provider profile'
      });
    }
  }

  async verifyProvider(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const provider = await this.providerService.verifyProvider(id);

      res.json({
        success: true,
        data: { provider },
        message: 'Provider verified successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to verify provider'
      });
    }
  }
}