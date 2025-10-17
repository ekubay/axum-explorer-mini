// src/app.ts
import express from 'express';
import cors from 'cors';
import { Database } from './infrastructure/database/database';
import { UserModel, ServiceProviderModel, BookingModel } from './infrastructure/database/mongooseSchemas';
import { MongooseUserRepository } from './infrastructure/repositories/MongooseUserRepository';
import { MongooseServiceProviderRepository } from './infrastructure/repositories/MongooseServiceProviderRepository';
import { MongooseBookingRepository } from './infrastructure/repositories/MongooseBookingRepository';
import { UserService } from './domain/services/UserService';
import { BookingService } from './domain/services/BookingService';
import { ServiceProviderService } from './domain/services/ServiceProviderService';
import { UserController } from './interfaces/controllers/UserController';
import { BookingController } from './interfaces/controllers/BookingController';
import { ServiceProviderController } from './interfaces/controllers/ServiceProviderController';
import userRoutes from './interfaces/routes/userRoutes';
import bookingRoutes from './interfaces/routes/bookingRoutes';
import providerRoutes from './interfaces/routes/providerRoutes';
import { AuthMiddleware } from './interfaces/middleware/auth';


export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupMiddleware();
    this.setupDependencies();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
  this.express.use(cors({
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  this.express.use(express.json());
  }

  private setupDependencies(): void {
    // Repository instances
    const userRepository = new MongooseUserRepository(UserModel);
    const providerRepository = new MongooseServiceProviderRepository(ServiceProviderModel);
    const bookingRepository = new MongooseBookingRepository(BookingModel);

    // Service instances
    const userService = new UserService(userRepository);
    const bookingService = new BookingService(bookingRepository);
    const providerService = new ServiceProviderService(providerRepository);

    // Controller instances
    const userController = new UserController(userService);
    const bookingController = new BookingController(bookingService);
    const providerController = new ServiceProviderController(providerService); // Fixed: only one parameter

    // Store in app for route access
    this.express.set('userController', userController);
    this.express.set('bookingController', bookingController);
    this.express.set('providerController', providerController);
  }

  // In src/app.ts - replace the setupRoutes method
private setupRoutes(): void {
  // Health check
  this.express.get('/api/health', (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      service: 'Axum Explorer Mini API'
    });
  });

  // Get controller instances
  const userController = this.express.get('userController');
  const bookingController = this.express.get('bookingController');
  const providerController = this.express.get('providerController');

  // AUTH ROUTES
  this.express.post('/api/auth/register', (req, res) => userController.register(req, res));
  this.express.post('/api/auth/login', (req, res) => userController.login(req, res));
  this.express.get('/api/auth/profile', AuthMiddleware.authenticate, (req, res) => userController.getProfile(req, res));

  // PROVIDER ROUTES
  this.express.post('/api/providers/register', AuthMiddleware.authenticate, (req, res) => providerController.register(req, res));
  this.express.get('/api/providers', (req, res) => providerController.listProviders(req, res));
  this.express.get('/api/providers/:id', (req, res) => providerController.getProviderById(req, res));

  // Add more routes as needed...
}
    
  public async start(port: number = 3000): Promise<void> {
    const db = Database.getInstance();
    await db.connect();

    this.express.listen(port, () => {
      console.log(`🚀 Axum Explorer Mini API running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/api/health`);
    });
  }
}