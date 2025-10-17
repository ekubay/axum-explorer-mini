// src/interfaces/routes/providerRoutes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';

export default (app: any): Router => {
  const router = Router();
  
  // Get the providerController instance from the app
  const providerController = app.get('providerController');

  router.post('/register', AuthMiddleware.authenticate, (req, res) => 
    providerController.register(req, res)
  );

  router.get('/', (req, res) => 
    providerController.listProviders(req, res)
  );

  router.get('/:id', (req, res) => 
    providerController.getProviderById(req, res)
  );

  router.get('/profile/me', AuthMiddleware.authenticate, (req, res) => 
    providerController.getMyProviderProfile(req, res)
  );

  router.put('/:id/verify', 
    AuthMiddleware.authenticate, 
    AuthMiddleware.authorize('admin'),
    (req, res) => providerController.verifyProvider(req, res)
  );

  return router;
};