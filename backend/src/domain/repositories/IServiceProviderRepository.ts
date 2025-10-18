// src/domain/repositories/IServiceProviderRepository.ts
import { ServiceProvider, ProviderType } from '../entities/ServiceProvider';

export interface IServiceProviderRepository {
  findById(id: string): Promise<ServiceProvider | null>;
  findByUserId(userId: string): Promise<ServiceProvider | null>;
  findByType(type: ProviderType): Promise<ServiceProvider[]>;
  findAll(): Promise<ServiceProvider[]>; // Add this
  save(provider: ServiceProvider): Promise<ServiceProvider>;
  findByVerificationStatus(status: string): Promise<ServiceProvider[]>;
  updateVerificationStatus(id: string, status: string): Promise<ServiceProvider | null>;
}