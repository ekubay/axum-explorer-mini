// src/interfaces/routes/bookingRoutes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';

export default (app: any): Router => {
  const router = Router();
  
  // Get the bookingController instance from the app (already initialized in app.ts)
  const bookingController = app.get('bookingController');

  router.post('/', AuthMiddleware.authenticate, (req, res) => 
    bookingController.createBooking(req, res)
  );

  router.get('/user', AuthMiddleware.authenticate, (req, res) => 
    bookingController.getUserBookings(req, res)
  );

  router.put('/:bookingId/confirm', AuthMiddleware.authenticate, (req, res) => 
    bookingController.confirmBooking(req, res)
  );

  router.put('/:bookingId/cancel', AuthMiddleware.authenticate, (req, res) => 
    bookingController.cancelBooking(req, res)
  );

  // Add a route to get booking by ID
  router.get('/:bookingId', AuthMiddleware.authenticate, (req, res) => 
    bookingController.getBookingById(req, res)
  );

  return router;
};