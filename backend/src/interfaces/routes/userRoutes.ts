// src/interfaces/routes/userRoutes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';

export default (app: any): Router => {
  const router = Router();
  
  // Get the userController instance from the app
  const userController = app.get('userController');

  router.post('/register', (req, res) => 
    userController.register(req, res)
  );

  router.post('/login', (req, res) => 
    userController.login(req, res)
  );

  router.get('/profile', AuthMiddleware.authenticate, (req, res) => 
    userController.getProfile(req, res)
  );

  return router;
};