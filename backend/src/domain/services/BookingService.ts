// In src/domain/services/BookingService.ts - complete update
import { Booking, BookingEntity, BookingService as BookingServiceType, BookingStatus } from '../entities/Booking';
import { IBookingRepository } from '../repositories/IBookingRepository';
import { CommissionService } from './CommissionService';
import config from '../../application/config';

export class BookingService {
  constructor(
    private bookingRepository: IBookingRepository,
    private commissionService: CommissionService
  ) {}

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

    const savedBooking = await this.bookingRepository.save(booking);

    // Create commission records for each service
    for (const service of services) {
      await this.commissionService.createCommission(
        savedBooking.id,
        service.serviceProviderId,
        service.serviceType,
        service.price
      );
    }

    return savedBooking;
  }
   //additional method

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

  async getBookingById(bookingId: string): Promise<Booking | null> {
    return await this.bookingRepository.findById(bookingId);
  }
 
  async createPackageBooking(
    userId: string,
    packageName: string,
    services: Array<{
      serviceType: 'hotel' | 'car_rental' | 'guide';
      serviceProviderId: string;
      details: any;
      startDate: Date;
      endDate: Date;
    }>,
    travelerCount: number,
    specialRequests?: string
  ): Promise<Booking> {
    // Validate all services exist and are available
    for (const service of services) {
      // Note: You'll need to inject providerRepository or service to validate providers
      // For now, we'll assume validation happens elsewhere
    }

    // Calculate prices and commissions
    const bookingServices = await this.calculateServicePrices(services);
    const totalCost = bookingServices.reduce((sum, service) => sum + service.price, 0);
    const commissionEarned = this.calculateCommission(bookingServices);

    // Create booking
    const booking = new BookingEntity(
      '', // ID will be generated
      userId,
      packageName,
      bookingServices,
      totalCost,
      commissionEarned,
      BookingStatus.PENDING,
      services[0].startDate,
      services[services.length - 1].endDate,
      travelerCount,
      specialRequests
    );

    const savedBooking = await this.bookingRepository.save(booking);

    // Create commission records for each service
    for (const service of bookingServices) {
      await this.commissionService.createCommission(
        savedBooking.id,
        service.serviceProviderId,
        service.serviceType,
        service.price
      );
    }

    return savedBooking;
  }


  private async calculateServicePrices(services: Array<{
    serviceType: 'hotel' | 'car_rental' | 'guide';
    serviceProviderId: string;
    details: any;
    startDate: Date;
    endDate: Date;
  }>): Promise<BookingServiceType[]> {
    const bookingServices: BookingServiceType[] = [];

    for (const service of services) {
      let price = 0;

      switch (service.serviceType) {
        case 'hotel':
          const nights = Math.ceil((service.endDate.getTime() - service.startDate.getTime()) / (1000 * 60 * 60 * 24));
          price = nights * (service.details.roomRate || 5000);
          break;

        case 'car_rental':
          const days = Math.ceil((service.endDate.getTime() - service.startDate.getTime()) / (1000 * 60 * 60 * 24));
          price = days * (service.details.dailyRate || 2000);
          break;

        case 'guide':
          const guideDays = Math.ceil((service.endDate.getTime() - service.startDate.getTime()) / (1000 * 60 * 60 * 24));
          price = guideDays * (service.details.dailyRate || 1500);
          break;
      }

      bookingServices.push({
        serviceType: service.serviceType,
        serviceProviderId: service.serviceProviderId,
        details: service.details,
        price: price
      });
    }

    return bookingServices;
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