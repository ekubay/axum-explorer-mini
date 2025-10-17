// src/interfaces/routes/bookingRoutes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { BookingController } from '../controllers/BookingController';

export default (bookingController: BookingController): Router => {
  const router = Router();

  router.post('/', AuthMiddleware.authenticate, (req, res) => bookingController.createBooking(req, res));
  router.get('/user', AuthMiddleware.authenticate, (req, res) => bookingController.getUserBookings(req, res));
  router.get('/:bookingId', AuthMiddleware.authenticate, (req, res) => bookingController.getBookingById(req, res));
  router.put('/:bookingId/confirm', AuthMiddleware.authenticate, (req, res) => bookingController.confirmBooking(req, res));
  router.put('/:bookingId/cancel', AuthMiddleware.authenticate, (req, res) => bookingController.cancelBooking(req, res));

  return router;
};