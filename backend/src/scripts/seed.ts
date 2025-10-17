// src/scripts/seed.ts
import mongoose from 'mongoose';
import { Database } from '../infrastructure/database/database';
import { UserModel } from '../infrastructure/database/mongooseSchemas';
import { UserRole } from '../domain/entities/User';
import bcrypt from 'bcryptjs';
import config from '../application/config';

async function seedDatabase() {
  try {
    const db = Database.getInstance();
    await db.connect();

    // Clear existing data
    await UserModel.deleteMany({});

    // Hash passwords properly
    const adminPasswordHash = await bcrypt.hash('admin123', config.auth.bcryptRounds);
    const touristPasswordHash = await bcrypt.hash('tourist123', config.auth.bcryptRounds);

    // Create admin user
    const adminUser = await UserModel.create({
      name: 'Admin User',
      email: 'admin@axumexplorer.com',
      passwordHash: adminPasswordHash,
      role: UserRole.ADMIN,
      isVerified: true,
      phone: '+251911223344'
    });

    // Create sample tourist
    const touristUser = await UserModel.create({
      name: 'Sample Tourist',
      email: 'tourist@example.com',
      passwordHash: touristPasswordHash,
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