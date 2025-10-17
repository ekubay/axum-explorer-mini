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

export class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    this.setupMiddleware();
    this.setupDependencies();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.express.use(cors());
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

  private setupRoutes(): void {
    // Health check
    this.express.get('/api/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'Axum Explorer Mini API'
      });
    });

    // Mount routes
    this.express.use('/api/auth', userRoutes(this.express));
    this.express.use('/api/bookings', bookingRoutes(this.express));
    this.express.use('/api/providers', providerRoutes(this.express));
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