// src/domain/entities/Commission.ts
export interface Commission {
  id: string;
  bookingId: string;
  serviceProviderId: string;
  serviceType: 'hotel' | 'car_rental' | 'guide';
  amount: number;
  commissionRate: number;
  providerEarnings: number;
  platformEarnings: number;
  status: 'pending' | 'paid' | 'cancelled';
  paymentDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class CommissionEntity implements Commission {
  constructor(
    public id: string,
    public bookingId: string,
    public serviceProviderId: string,
    public serviceType: 'hotel' | 'car_rental' | 'guide',
    public amount: number,
    public commissionRate: number,
    public providerEarnings: number,
    public platformEarnings: number,
    public status: 'pending' | 'paid' | 'cancelled' = 'pending',
    public paymentDate?: Date,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}

  static create(
    bookingId: string,
    serviceProviderId: string,
    serviceType: 'hotel' | 'car_rental' | 'guide',
    amount: number,
    commissionRate: number
  ): CommissionEntity {
    const platformEarnings = amount * commissionRate;
    const providerEarnings = amount - platformEarnings;

    return new CommissionEntity(
      '',
      bookingId,
      serviceProviderId,
      serviceType,
      amount,
      commissionRate,
      providerEarnings,
      platformEarnings
    );
  }

  markAsPaid(): void {
    this.status = 'paid';
    this.paymentDate = new Date();
    this.updatedAt = new Date();
  }

  cancel(): void {
    this.status = 'cancelled';
    this.updatedAt = new Date();
  }
}