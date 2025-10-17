// src/infrastructure/database/database.ts
import mongoose from 'mongoose';
import config from '../../application/config';

export class Database {
  private static instance: Database;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log('📊 Database already connected');
      return;
    }

    try {
      const { uri, options } = config.database;
      
      await mongoose.connect(uri, options);
      
      this.isConnected = true;
      console.log('✅ Connected to MongoDB successfully');
      
      // Event listeners
      mongoose.connection.on('error', (error) => {
        console.error('❌ MongoDB connection error:', error);
        this.isConnected = false;
      });

      mongoose.connection.on('disconnected', () => {
        console.log('📊 MongoDB disconnected');
        this.isConnected = false;
      });

      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
        this.isConnected = true;
      });

    } catch (error) {
      console.error('❌ Failed to connect to MongoDB:', error);
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('📊 MongoDB disconnected successfully');
    } catch (error) {
      console.error('❌ Error disconnecting from MongoDB:', error);
    }
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }

  getMongooseConnection(): typeof mongoose.connection {
    return mongoose.connection;
  }
}