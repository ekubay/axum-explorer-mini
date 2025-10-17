// src/domain/entities/ServiceProvider.ts
export enum ProviderType {
  HOTEL = 'hotel',
  CAR_RENTAL = 'car_rental',
  GUIDE = 'guide'
}

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export interface ServiceProvider {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  type: ProviderType;
  contactInfo: {
    phone: string;
    email: string;
    address: string;
  };
  verificationStatus: VerificationStatus;
  location: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceProviderEntity implements ServiceProvider {
  constructor(
    public id: string,
    public userId: string,
    public businessName: string,
    public description: string,
    public type: ProviderType,
    public contactInfo: { phone: string; email: string; address: string },
    public verificationStatus: VerificationStatus = VerificationStatus.PENDING,
    public location: { latitude: number; longitude: number },
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    userId: string,
    businessName: string,
    description: string,
    type: ProviderType,
    contactInfo: { phone: string; email: string; address: string },
    location: { latitude: number; longitude: number }
  ): ServiceProviderEntity {
    return new ServiceProviderEntity(
      '',
      userId,
      businessName,
      description,
      type,
      contactInfo,
      VerificationStatus.PENDING,
      location,
      true
    );
  }

  verify(): void {
    this.verificationStatus = VerificationStatus.VERIFIED;
    this.updatedAt = new Date();
  }

  reject(): void {
    this.verificationStatus = VerificationStatus.REJECTED;
    this.updatedAt = new Date();
  }
}