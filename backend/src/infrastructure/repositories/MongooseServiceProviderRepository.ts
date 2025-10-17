// src/infrastructure/repositories/MongooseServiceProviderRepository.ts
import { Model } from 'mongoose';
import { ServiceProvider, ProviderType, VerificationStatus } from '../../domain/entities/ServiceProvider';
import { IServiceProviderRepository } from '../../domain/repositories/IServiceProviderRepository';

// ... rest of the code remains the same

export class MongooseServiceProviderRepository implements IServiceProviderRepository {
  private providerModel: Model<any>;

  constructor(providerModel: Model<any>) {
    this.providerModel = providerModel;
  }

  async findById(id: string): Promise<ServiceProvider | null> {
    const doc = await this.providerModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }
  async findAll(): Promise<ServiceProvider[]> {
    const docs = await this.providerModel.find({ isActive: true });
    return docs.map(doc => this.toEntity(doc));
  }
  async findByUserId(userId: string): Promise<ServiceProvider | null> {
    const doc = await this.providerModel.findOne({ userId });
    return doc ? this.toEntity(doc) : null;
  }

  async findByType(type: ProviderType): Promise<ServiceProvider[]> {
    const docs = await this.providerModel.find({ type, isActive: true });
    return docs.map(doc => this.toEntity(doc));
  }

  async save(provider: ServiceProvider): Promise<ServiceProvider> {
    if (provider.id) {
      const updatedDoc = await this.providerModel.findByIdAndUpdate(
        provider.id,
        { $set: this.toDocument(provider) },
        { new: true }
      );
      return this.toEntity(updatedDoc);
    } else {
      const newDoc = new this.providerModel(this.toDocument(provider));
      const savedDoc = await newDoc.save();
      return this.toEntity(savedDoc);
    }
  }

  async updateVerificationStatus(id: string, status: VerificationStatus): Promise<ServiceProvider | null> {
    const updatedDoc = await this.providerModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          verificationStatus: status,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    return updatedDoc ? this.toEntity(updatedDoc) : null;
  }

  private toEntity(doc: any): ServiceProvider {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      businessName: doc.businessName,
      description: doc.description,
      type: doc.type as ProviderType,
      contactInfo: doc.contactInfo,
      verificationStatus: doc.verificationStatus as VerificationStatus,
      location: doc.location,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toDocument(provider: ServiceProvider): any {
    return {
      userId: provider.userId,
      businessName: provider.businessName,
      description: provider.description,
      type: provider.type,
      contactInfo: provider.contactInfo,
      verificationStatus: provider.verificationStatus,
      location: provider.location,
      isActive: provider.isActive,
      createdAt: provider.createdAt,
      updatedAt: provider.updatedAt
    };
  }
}