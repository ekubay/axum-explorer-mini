// src/domain/repositories/ICommissionRepository.ts
import { Commission } from '../entities/Commission';

export interface ICommissionRepository {
  findById(id: string): Promise<Commission | null>;
  findByBookingId(bookingId: string): Promise<Commission[]>;
  findByProviderId(providerId: string): Promise<Commission[]>;
  findByStatus(status: string): Promise<Commission[]>;
  save(commission: Commission): Promise<Commission>;
  updateStatus(id: string, status: string): Promise<Commission | null>;
  getPlatformEarnings(startDate?: Date, endDate?: Date): Promise<number>;
  getProviderEarnings(providerId: string, startDate?: Date, endDate?: Date): Promise<number>;
}