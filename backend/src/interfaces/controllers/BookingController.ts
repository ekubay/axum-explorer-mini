// src/interfaces/controllers/BookingController.ts
import { Request, Response } from 'express';
import { BookingService } from '../../domain/services/BookingService';

export class BookingController {
  constructor(private bookingService: BookingService) {}

  async createBooking(req: Request, res: Response): Promise<void> {
    try {
      const {
        packageName,
        services,
        startDate,
        endDate,
        travelerCount,
        specialRequests
      } = req.body;

      const userId = (req as any).user?.id;

      const booking = await this.bookingService.createBooking(
        userId,
        packageName,
        services,
        new Date(startDate),
        new Date(endDate),
        travelerCount,
        specialRequests
      );

      res.status(201).json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Booking creation failed'
      });
    }
  }

  async confirmBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const booking = await this.bookingService.confirmBooking(bookingId);

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Booking confirmation failed'
      });
    }
  }

  async getUserBookings(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      const bookings = await this.bookingService.getUserBookings(userId);

      res.json({
        success: true,
        data: { bookings }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch bookings'
      });
    }
  }

  async cancelBooking(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const booking = await this.bookingService.cancelBooking(bookingId);

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Booking cancellation failed'
      });
    }
  }

  async getBookingById(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId } = req.params;
      const userId = (req as any).user?.id;

      // FIXED: Changed from getBookingByUserId to getBookingById
      const booking = await this.bookingService.getBookingById(bookingId);
      
      if (!booking) {
        res.status(404).json({
          success: false,
          message: 'Booking not found'
        });
        return;
      }

      // Optional: Check if the user owns this booking (for security)
      if (booking.userId !== userId) {
        res.status(403).json({
          success: false,
          message: 'Access denied to this booking'
        });
        return;
      }

      res.json({
        success: true,
        data: { booking }
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch booking'
      });
    }
  }
}