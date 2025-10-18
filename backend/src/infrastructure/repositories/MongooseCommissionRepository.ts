// src/infrastructure/repositories/MongooseCommissionRepository.ts
import { Model } from 'mongoose';
import { Commission } from '../../domain/entities/Commission';
import { ICommissionRepository } from '../../domain/repositories/ICommissionRepository';

export class MongooseCommissionRepository implements ICommissionRepository {
  constructor(private commissionModel: Model<any>) {}

  async findById(id: string): Promise<Commission | null> {
    const doc = await this.commissionModel.findById(id);
    return doc ? this.toEntity(doc) : null;
  }

  async findByBookingId(bookingId: string): Promise<Commission[]> {
    const docs = await this.commissionModel.find({ bookingId });
    return docs.map(doc => this.toEntity(doc));
  }

  async findByProviderId(providerId: string): Promise<Commission[]> {
    const docs = await this.commissionModel.find({ serviceProviderId: providerId });
    return docs.map(doc => this.toEntity(doc));
  }

  async findByStatus(status: string): Promise<Commission[]> {
    const docs = await this.commissionModel.find({ status });
    return docs.map(doc => this.toEntity(doc));
  }

  async save(commission: Commission): Promise<Commission> {
    if (commission.id) {
      const updatedDoc = await this.commissionModel.findByIdAndUpdate(
        commission.id,
        { $set: this.toDocument(commission) },
        { new: true }
      );
      return this.toEntity(updatedDoc);
    } else {
      const newDoc = new this.commissionModel(this.toDocument(commission));
      const savedDoc = await newDoc.save();
      return this.toEntity(savedDoc);
    }
  }

  async updateStatus(id: string, status: string): Promise<Commission | null> {
    const updatedDoc = await this.commissionModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status,
          updatedAt: new Date(),
          ...(status === 'paid' && { paymentDate: new Date() })
        }
      },
      { new: true }
    );
    return updatedDoc ? this.toEntity(updatedDoc) : null;
  }

  async getPlatformEarnings(startDate?: Date, endDate?: Date): Promise<number> {
    const match: any = { status: 'paid' };
    if (startDate || endDate) {
      match.paymentDate = {};
      if (startDate) match.paymentDate.$gte = startDate;
      if (endDate) match.paymentDate.$lte = endDate;
    }

    const result = await this.commissionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$platformEarnings' } } }
    ]);

    return result[0]?.total || 0;
  }

  async getProviderEarnings(providerId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const match: any = { serviceProviderId: providerId, status: 'paid' };
    if (startDate || endDate) {
      match.paymentDate = {};
      if (startDate) match.paymentDate.$gte = startDate;
      if (endDate) match.paymentDate.$lte = endDate;
    }

    const result = await this.commissionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$providerEarnings' } } }
    ]);

    return result[0]?.total || 0;
  }

  private toEntity(doc: any): Commission {
    return {
      id: doc._id.toString(),
      bookingId: doc.bookingId.toString(),
      serviceProviderId: doc.serviceProviderId.toString(),
      serviceType: doc.serviceType,
      amount: doc.amount,
      commissionRate: doc.commissionRate,
      providerEarnings: doc.providerEarnings,
      platformEarnings: doc.platformEarnings,
      status: doc.status,
      paymentDate: doc.paymentDate,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toDocument(commission: Commission): any {
    return {
      bookingId: commission.bookingId,
      serviceProviderId: commission.serviceProviderId,
      serviceType: commission.serviceType,
      amount: commission.amount,
      commissionRate: commission.commissionRate,
      providerEarnings: commission.providerEarnings,
      platformEarnings: commission.platformEarnings,
      status: commission.status,
      paymentDate: commission.paymentDate,
      createdAt: commission.createdAt,
      updatedAt: commission.updatedAt
    };
  }
}