// src/infrastructure/database/mongooseSchemas.ts
import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['tourist', 'provider', 'admin'],
    required: true 
  },
  phone: String,
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const serviceProviderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  businessName: { type: String, required: true },
  description: String,
  type: {
    type: String,
    enum: ['hotel', 'car_rental', 'guide'],
    required: true
  },
  contactInfo: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// commission schema
const commissionSchema = new Schema({
  bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
  serviceProviderId: { type: Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  serviceType: {
    type: String,
    enum: ['hotel', 'car_rental', 'guide'],
    required: true
  },
  amount: { type: Number, required: true },
  commissionRate: { type: Number, required: true },
  providerEarnings: { type: Number, required: true },
  platformEarnings: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// export const CommissionModel = mongoose.model('Commission', commissionSchema);
// const serviceProviderSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   businessName: { type: String, required: true },
//   description: String,
//   type: {
//     type: String,
//     enum: ['hotel', 'car_rental', 'guide'],
//     required: true
//   },
//   contactInfo: {
//     phone: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: true }
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['pending', 'verified', 'rejected'],
//     default: 'pending'
//   },
//   location: {
//     latitude: { type: Number, required: true },
//     longitude: { type: Number, required: true }
//   },
//   isActive: { type: Boolean, default: true },
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now }
// });
  // booking schema
const bookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  packageName: { type: String, required: true },
  services: [{
    serviceType: {
      type: String,
      enum: ['hotel', 'car_rental', 'guide'],
      required: true
    },
    serviceProviderId: { 
      type: Schema.Types.ObjectId, 
      ref: 'ServiceProvider', 
      required: true 
    },
    details: Schema.Types.Mixed,
    price: { type: Number, required: true }
  }],
  totalCost: { type: Number, required: true },
  commissionEarned: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  travelerCount: { type: Number, required: true, min: 1 },
  specialRequests: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const UserModel = mongoose.model('User', userSchema);
export const ServiceProviderModel = mongoose.model('ServiceProvider', serviceProviderSchema);
export const BookingModel = mongoose.model('Booking', bookingSchema);
export const CommissionModel = mongoose.model('Commission', commissionSchema);
