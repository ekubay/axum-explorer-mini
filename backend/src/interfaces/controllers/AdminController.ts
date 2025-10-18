import { Request, Response } from 'express';
import { ServiceProviderService } from '../../domain/services/ServiceProviderService';

export class AdminController {
  constructor(private providerService: ServiceProviderService) {}

  async getPendingProviders(req: Request, res: Response): Promise<void> {
    try {
      const providers = await this.providerService.getProvidersByStatus('pending');
      
      res.json({
        success: true,
        data: { providers }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch pending providers'
      });
    }
  }

  async verifyProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const provider = await this.providerService.verifyProvider(providerId);

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

  async rejectProvider(req: Request, res: Response): Promise<void> {
    try {
      const { providerId } = req.params;
      const provider = await this.providerService.rejectProvider(providerId);

      res.json({
        success: true,
        data: { provider },
        message: 'Provider rejected successfully'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to reject provider'
      });
    }
  }
}