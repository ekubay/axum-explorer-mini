// src/domain/services/CommissionService.ts
import { Commission, CommissionEntity } from '../entities/Commission';
import { ICommissionRepository } from '../repositories/ICommissionRepository';
import config from '../../application/config';

export class CommissionService {
  constructor(private commissionRepository: ICommissionRepository) {}

  async createCommission(
    bookingId: string,
    serviceProviderId: string,
    serviceType: 'hotel' | 'car_rental' | 'guide',
    amount: number
  ): Promise<Commission> {
    const commissionRate = this.getCommissionRate(serviceType);
    const commission = CommissionEntity.create(
      bookingId,
      serviceProviderId,
      serviceType,
      amount,
      commissionRate
    );

    return await this.commissionRepository.save(commission);
  }

  async getProviderCommissions(providerId: string): Promise<Commission[]> {
    return await this.commissionRepository.findByProviderId(providerId);
  }

  async getPendingCommissions(): Promise<Commission[]> {
    return await this.commissionRepository.findByStatus('pending');
  }

  async markCommissionAsPaid(commissionId: string): Promise<Commission> {
    const commission = await this.commissionRepository.findById(commissionId);
    if (!commission) {
      throw new Error('Commission not found');
    }

    const commissionEntity = new CommissionEntity(
      commission.id,
      commission.bookingId,
      commission.serviceProviderId,
      commission.serviceType,
      commission.amount,
      commission.commissionRate,
      commission.providerEarnings,
      commission.platformEarnings,
      commission.status,
      commission.paymentDate,
      commission.createdAt,
      commission.updatedAt
    );

    commissionEntity.markAsPaid();
    return await this.commissionRepository.save(commissionEntity);
  }

  async getPlatformRevenue(startDate?: Date, endDate?: Date): Promise<number> {
    return await this.commissionRepository.getPlatformEarnings(startDate, endDate);
  }

  async getProviderRevenue(providerId: string, startDate?: Date, endDate?: Date): Promise<number> {
    return await this.commissionRepository.getProviderEarnings(providerId, startDate, endDate);
  }

  private getCommissionRate(serviceType: 'hotel' | 'car_rental' | 'guide'): number {
    switch (serviceType) {
      case 'hotel':
        return config.commission.hotel.default; // 12.5%
      case 'car_rental':
        return config.commission.carRental.default; // 10%
      case 'guide':
        return config.commission.guide.default; // 10%
      default:
        return 0.10; // 10% default
    }
  }
}