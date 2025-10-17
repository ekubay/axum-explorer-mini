// src/infrastructure/repositories/MongooseBookingRepository.ts
import { Model } from 'mongoose';
import { Booking, BookingStatus } from '../../domain/entities/Booking';
import { IBookingRepository } from '../../domain/repositories/IBookingRepository';

export class MongooseBookingRepository implements IBookingRepository {
  constructor(private bookingModel: Model<any>) {}

  async findById(id: string): Promise<Booking | null> {
    const doc = await this.bookingModel.findById(id).populate('userId').populate('services.serviceProviderId');
    return doc ? this.toEntity(doc) : null;
  }

  async findByUserId(userId: string): Promise<Booking[]> {
    const docs = await this.bookingModel.find({ userId }).populate('services.serviceProviderId');
    return docs.map(doc => this.toEntity(doc));
  }

  async findAll(): Promise<Booking[]> {
    const docs = await this.bookingModel.find().populate('userId').populate('services.serviceProviderId');
    return docs.map(doc => this.toEntity(doc));
  }

  async save(booking: Booking): Promise<Booking> {
    if (booking.id) {
      const updatedDoc = await this.bookingModel.findByIdAndUpdate(
        booking.id,
        { $set: this.toDocument(booking) },
        { new: true }
      );
      return this.toEntity(updatedDoc);
    } else {
      const newDoc = new this.bookingModel(this.toDocument(booking));
      const savedDoc = await newDoc.save();
      return this.toEntity(savedDoc);
    }
  }

  async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const updatedDoc = await this.bookingModel.findByIdAndUpdate(
      id,
      { 
        $set: { 
          status,
          updatedAt: new Date()
        }
      },
      { new: true }
    );
    return updatedDoc ? this.toEntity(updatedDoc) : null;
  }

  private toEntity(doc: any): Booking {
    return {
      id: doc._id.toString(),
      userId: doc.userId.toString(),
      packageName: doc.packageName,
      services: doc.services,
      totalCost: doc.totalCost,
      commissionEarned: doc.commissionEarned,
      status: doc.status as BookingStatus,
      startDate: doc.startDate,
      endDate: doc.endDate,
      travelerCount: doc.travelerCount,
      specialRequests: doc.specialRequests,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toDocument(booking: Booking): any {
    return {
      userId: booking.userId,
      packageName: booking.packageName,
      services: booking.services,
      totalCost: booking.totalCost,
      commissionEarned: booking.commissionEarned,
      status: booking.status,
      startDate: booking.startDate,
      endDate: booking.endDate,
      travelerCount: booking.travelerCount,
      specialRequests: booking.specialRequests,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt
    };
  }
}