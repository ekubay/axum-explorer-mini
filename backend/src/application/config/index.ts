// src/application/config/index.ts
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export interface DatabaseConfig {
  uri: string;
  options: {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
  };
}

export interface AuthConfig {
  jwtSecret: string;
  jwtExpiresIn: string;
  bcryptRounds: number;
}

export interface ServerConfig {
  port: number;
  environment: string;
  corsOrigin: string;
}

export interface CommissionConfig {
  hotel: {
    min: number;
    max: number;
    default: number;
  };
  carRental: {
    min: number;
    max: number;
    default: number;
  };
  guide: {
    min: number;
    max: number;
    default: number;
  };
}

export interface AppConfig {
  database: DatabaseConfig;
  auth: AuthConfig;
  server: ServerConfig;
  commission: CommissionConfig;
}

const config: AppConfig = {
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/axum-explorer',
    options: {
      maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE || '10'),
      serverSelectionTimeoutMS: parseInt(process.env.DB_SERVER_SELECTION_TIMEOUT || '30000'),
      socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT || '45000')
    }
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'your-default-jwt-secret-key-change-in-production',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12')
  },

  server: {
    port: parseInt(process.env.PORT || '3000'),
    environment: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001'
  },

  commission: {
    hotel: {
      min: 0.10, // 10%
      max: 0.15, // 15%
      default: 0.125 // 12.5%
    },
    carRental: {
      min: 0.08, // 8%
      max: 0.12, // 12%
      default: 0.10 // 10%
    },
    guide: {
      min: 0.10, // 10%
      max: 0.10, // 10%
      default: 0.10 // 10%
    }
  }
};

// Validation
if (!config.auth.jwtSecret || config.auth.jwtSecret === 'your-default-jwt-secret-key-change-in-production') {
  console.warn('⚠️  WARNING: Using default JWT secret. Please set JWT_SECRET in production!');
}

if (config.server.environment === 'production') {
  if (config.auth.jwtSecret.includes('default') || config.auth.jwtSecret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long in production');
  }
  
  if (config.database.uri.includes('localhost')) {
    console.warn('⚠️  WARNING: Using local database in production. Consider using a cloud database.');
  }
}

export default config;