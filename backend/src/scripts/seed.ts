// src/scripts/seed.ts
import mongoose from 'mongoose';
import { Database } from '../infrastructure/database/database';
import { UserModel } from '../infrastructure/database/mongooseSchemas';
import { UserRole } from '../domain/entities/User';

async function seedDatabase() {
  try {
    const db = Database.getInstance();
    await db.connect();

    // Clear existing data
    await UserModel.deleteMany({});

    // Create admin user
    const adminUser = await UserModel.create({
      name: 'Admin User',
      email: 'admin@axumexplorer.com',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0L6kZrOaRWF4A5a6Ae9VKJ2K9K9p9p9p9p9p9p', // hashed "admin123"
      role: UserRole.ADMIN,
      isVerified: true,
      phone: '+251911223344'
    });

    // Create sample tourist
    const touristUser = await UserModel.create({
      name: 'Sample Tourist',
      email: 'tourist@example.com',
      passwordHash: '$2a$12$LQv3c1yqBWVHxkd0L6kZrOaRWF4A5a6Ae9VKJ2K9K9p9p9p9p9p9p', // hashed "tourist123"
      role: UserRole.TOURIST,
      isVerified: true,
      phone: '+251944556677'
    });

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin credentials:');
    console.log('   Email: admin@axumexplorer.com');
    console.log('   Password: admin123');
    console.log('👤 Tourist credentials:');
    console.log('   Email: tourist@example.com');
    console.log('   Password: tourist123');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();