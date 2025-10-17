// src/interfaces/routes/userRoutes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth';
import { UserController } from '../controllers/UserController';

export default (userController: UserController): Router => {
  const router = Router();

  router.post('/register', (req, res) => userController.register(req, res));
  router.post('/login', (req, res) => userController.login(req, res));
  router.get('/profile', AuthMiddleware.authenticate, (req, res) => userController.getProfile(req, res));

  return router;
};