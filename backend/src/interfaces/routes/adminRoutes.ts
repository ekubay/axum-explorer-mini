import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { AdminController } from '../controllers/AdminController';

export default (adminController: AdminController): Router => {
  const router = Router();

  // Admin only routes
  router.get('/providers/pending', 
    AuthMiddleware.authenticate, 
    AuthMiddleware.authorize('admin'),
    (req, res) => adminController.getPendingProviders(req, res)
  );

  router.put('/providers/:providerId/verify',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin'),
    (req, res) => adminController.verifyProvider(req, res)
  );

  router.put('/providers/:providerId/reject',
    AuthMiddleware.authenticate,
    AuthMiddleware.authorize('admin'),
    (req, res) => adminController.rejectProvider(req, res)
  );

  return router;
};