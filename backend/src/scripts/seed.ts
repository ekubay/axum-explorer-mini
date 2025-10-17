import mongoose from 'mongoose';
import { Database } from '../infrastructure/database/database';
import { UserModel, ServiceProviderModel } from '../infrastructure/database/mongooseSchemas';
import { UserRole } from '../domain/entities/User';
import bcrypt from 'bcryptjs';
import config from '../application/config';

async function seedDatabase() {
  try {
    const db = Database.getInstance();
    await db.connect();

    // Clear existing data
    await UserModel.deleteMany({});
    await ServiceProviderModel.deleteMany({});

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

    // Create sample providers
    const sampleProviders = [
      {
        userId: adminUser._id,
        businessName: 'Axum Heritage Hotel',
        description: 'Comfortable accommodations in the heart of Axum with modern amenities and traditional Ethiopian hospitality.',
        type: 'hotel',
        contactInfo: {
          phone: '+251911223344',
          email: 'info@axumheritage.com',
          address: 'Central Axum, near St. Mary of Zion Church'
        },
        location: {
          latitude: 14.1214,
          longitude: 38.7233
        },
        verificationStatus: 'verified',
        isActive: true
      },
      {
        userId: touristUser._id,
        businessName: 'Axum Tour Guides',
        description: 'Experienced local guides for historical and cultural tours of Axum and surrounding areas.',
        type: 'guide',
        contactInfo: {
          phone: '+251944556677',
          email: 'guides@axumtours.com',
          address: 'Axum Tourist Information Center'
        },
        location: {
          latitude: 14.1218,
          longitude: 38.7241
        },
        verificationStatus: 'verified',
        isActive: true
      },
      {
        userId: adminUser._id,
        businessName: 'Queen of Sheba Car Rental',
        description: 'Reliable vehicle rentals with experienced drivers for exploring Axum and surrounding historical sites.',
        type: 'car_rental',
        contactInfo: {
          phone: '+251922334455',
          email: 'rentals@shebaaxum.com',
          address: 'Axum Main Road, near the Obelisks'
        },
        location: {
          latitude: 14.1209,
          longitude: 38.7228
        },
        verificationStatus: 'verified',
        isActive: true
      }
    ];

    await ServiceProviderModel.create(sampleProviders);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin credentials:');
    console.log('   Email: admin@axumexplorer.com');
    console.log('   Password: admin123');
    console.log('👤 Tourist credentials:');
    console.log('   Email: tourist@example.com');
    console.log('   Password: tourist123');
    console.log('🏨 Sample providers created:');
    console.log('   - Axum Heritage Hotel (Hotel)');
    console.log('   - Axum Tour Guides (Guide)');
    console.log('   - Queen of Sheba Car Rental (Car Rental)');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();