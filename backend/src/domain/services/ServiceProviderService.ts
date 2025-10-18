// src/domain/services/ServiceProviderService.ts
import { ServiceProvider, ServiceProviderEntity, ProviderType, VerificationStatus } from '../entities/ServiceProvider';
import { IServiceProviderRepository } from '../repositories/IServiceProviderRepository';

export class ServiceProviderService {
  constructor(private providerRepository: IServiceProviderRepository) {}

  async registerProvider(
    userId: string,
    businessName: string,
    description: string,
    type: ProviderType,
    contactInfo: { phone: string; email: string; address: string },
    location: { latitude: number; longitude: number }
  ): Promise<ServiceProvider> {
    const existingProvider = await this.providerRepository.findByUserId(userId);
    if (existingProvider) {
      throw new Error('User already has a service provider account');
    }

    const provider = ServiceProviderEntity.create(
      userId,
      businessName,
      description,
      type,
      contactInfo,
      location
    );

    return await this.providerRepository.save(provider);
  }

  async listProviders(type?: ProviderType, verifiedOnly: boolean = true): Promise<ServiceProvider[]> {
    let providers: ServiceProvider[];
    
    if (type) {
      providers = await this.providerRepository.findByType(type);
    } else {
      providers = await this.providerRepository.findAll();
    }

    if (verifiedOnly) {
      providers = providers.filter(provider => 
        provider.verificationStatus === VerificationStatus.VERIFIED
      );
    }

    return providers;
  }

  async verifyProvider(providerId: string): Promise<ServiceProvider> {
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const providerEntity = new ServiceProviderEntity(
      provider.id,
      provider.userId,
      provider.businessName,
      provider.description,
      provider.type,
      provider.contactInfo,
      provider.verificationStatus,
      provider.location,
      provider.isActive,
      provider.createdAt,
      provider.updatedAt
    );

    providerEntity.verify();
    return await this.providerRepository.save(providerEntity);
  }
  // In src/domain/services/ServiceProviderService.ts - Add this method:
  async getProviderById(providerId: string): Promise<ServiceProvider | null> {
    return await this.providerRepository.findById(providerId);
}
  async getProviderByUserId(userId: string): Promise<ServiceProvider | null> {
    return await this.providerRepository.findByUserId(userId);
  }
  async getProvidersByStatus(status: string): Promise<ServiceProvider[]> {
   return await this.providerRepository.findByVerificationStatus(status);
  }
  async rejectProvider(providerId: string): Promise<ServiceProvider> {
    const provider = await this.providerRepository.findById(providerId);
    if (!provider) {
      throw new Error('Provider not found');
    }

    const providerEntity = new ServiceProviderEntity(
      provider.id,
      provider.userId,
      provider.businessName,
      provider.description,
      provider.type,
      provider.contactInfo,
      provider.verificationStatus,
      provider.location,
      provider.isActive,
      provider.createdAt,
      provider.updatedAt
    );

    providerEntity.reject();
    return await this.providerRepository.save(providerEntity);
  }
}