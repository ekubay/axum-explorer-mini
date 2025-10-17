// src/domain/repositories/IBookingRepository.ts
import { Booking, BookingStatus } from '../entities/Booking';

export interface IBookingRepository {
  findById(id: string): Promise<Booking | null>;
  findByUserId(userId: string): Promise<Booking[]>;
  findAll(): Promise<Booking[]>;
  save(booking: Booking): Promise<Booking>;
  updateStatus(id: string, status: BookingStatus): Promise<Booking | null>;
}