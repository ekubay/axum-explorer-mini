// src/domain/services/BookingService.ts
import { Booking, BookingEntity, BookingService as BookingServiceType, BookingStatus } from '../entities/Booking';
import { IBookingRepository } from '../repositories/IBookingRepository';
import config from '../../application/config';

export class BookingService {
  constructor(private bookingRepository: IBookingRepository) {}

  async createBooking(
    userId: string,
    packageName: string,
    services: BookingServiceType[],
    startDate: Date,
    endDate: Date,
    travelerCount: number,
    specialRequests?: string
  ): Promise<Booking> {
    if (startDate >= endDate) {
      throw new Error('End date must be after start date');
    }

    if (travelerCount < 1) {
      throw new Error('Traveler count must be at least 1');
    }

    const booking = BookingEntity.create(
      userId,
      packageName,
      services,
      startDate,
      endDate,
      travelerCount,
      specialRequests
    );

    return await this.bookingRepository.save(booking);
  }

  async confirmBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (booking.status !== BookingStatus.PENDING) {
      throw new Error('Booking cannot be confirmed');
    }

    const bookingEntity = new BookingEntity(
      booking.id,
      booking.userId,
      booking.packageName,
      booking.services,
      booking.totalCost,
      booking.commissionEarned,
      booking.status,
      booking.startDate,
      booking.endDate,
      booking.travelerCount,
      booking.specialRequests,
      booking.createdAt,
      booking.updatedAt
    );

    bookingEntity.confirm();
    return await this.bookingRepository.save(bookingEntity);
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return await this.bookingRepository.findByUserId(userId);
  }
  
  async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingRepository.findById(bookingId);
    }

  async cancelBooking(bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const bookingEntity = new BookingEntity(
      booking.id,
      booking.userId,
      booking.packageName,
      booking.services,
      booking.totalCost,
      booking.commissionEarned,
      booking.status,
      booking.startDate,
      booking.endDate,
      booking.travelerCount,
      booking.specialRequests,
      booking.createdAt,
      booking.updatedAt
    );

    bookingEntity.cancel();
    return await this.bookingRepository.save(bookingEntity);
  }

  private calculateCommission(services: BookingServiceType[]): number {
    return services.reduce((commission, service) => {
      switch (service.serviceType) {
        case 'hotel':
          return commission + (service.price * config.commission.hotel.default);
        case 'car_rental':
          return commission + (service.price * config.commission.carRental.default);
        case 'guide':
          return commission + (service.price * config.commission.guide.default);
        default:
          return commission;
      }
    }, 0);
  }
}