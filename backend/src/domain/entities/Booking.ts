// src/domain/entities/Booking.ts
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface BookingService {
  serviceType: 'hotel' | 'car_rental' | 'guide';
  serviceProviderId: string;
  details: any; // Flexible details based on service type
  price: number;
}

export interface Booking {
  id: string;
  userId: string;
  packageName: string;
  services: BookingService[];
  totalCost: number;
  commissionEarned: number;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  travelerCount: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BookingEntity implements Booking {
  constructor(
    public id: string,
    public userId: string,
    public packageName: string,
    public services: BookingService[],
    public totalCost: number,
    public commissionEarned: number,
    public status: BookingStatus,
    public startDate: Date,
    public endDate: Date,
    public travelerCount: number,
    public specialRequests?: string,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    userId: string,
    packageName: string,
    services: BookingService[],
    startDate: Date,
    endDate: Date,
    travelerCount: number,
    specialRequests?: string
  ): BookingEntity {
    const totalCost = services.reduce((sum, service) => sum + service.price, 0);
    const commissionEarned = this.calculateCommission(services);
    
    return new BookingEntity(
      '',
      userId,
      packageName,
      services,
      totalCost,
      commissionEarned,
      BookingStatus.PENDING,
      startDate,
      endDate,
      travelerCount,
      specialRequests
    );
  }

  private static calculateCommission(services: BookingService[]): number {
    return services.reduce((commission, service) => {
      switch (service.serviceType) {
        case 'hotel':
          return commission + (service.price * 0.125); // 12.5% average
        case 'car_rental':
          return commission + (service.price * 0.10); // 10% average
        case 'guide':
          return commission + (service.price * 0.10); // 10%
        default:
          return commission;
      }
    }, 0);
  }

  confirm(): void {
    this.status = BookingStatus.CONFIRMED;
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = BookingStatus.CANCELLED;
    this.updatedAt = new Date();
  }

  complete(): void {
    this.status = BookingStatus.COMPLETED;
    this.updatedAt = new Date();
  }
}