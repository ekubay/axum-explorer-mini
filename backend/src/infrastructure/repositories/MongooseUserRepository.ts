// src/infrastructure/repositories/MongooseUserRepository.ts
import { Model } from 'mongoose';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';

export class MongooseUserRepository implements IUserRepository {
  constructor(private userModel: Model<any>) {}

  async findByEmail(email: string): Promise<User | null> {
    const userDoc = await this.userModel.findOne({ email });
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async findById(id: string): Promise<User | null> {
    const userDoc = await this.userModel.findById(id);
    return userDoc ? this.toEntity(userDoc) : null;
  }

  async save(user: User): Promise<User> {
    if (user.id) {
      const updatedDoc = await this.userModel.findByIdAndUpdate(
        user.id,
        { $set: this.toDocument(user) },
        { new: true }
      );
      return this.toEntity(updatedDoc);
    } else {
      const newDoc = new this.userModel(this.toDocument(user));
      const savedDoc = await newDoc.save();
      return this.toEntity(savedDoc);
    }
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const updatedDoc = await this.userModel.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );
    return updatedDoc ? this.toEntity(updatedDoc) : null;
  }

  private toEntity(doc: any): User {
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      passwordHash: doc.passwordHash,
      role: doc.role,
      phone: doc.phone,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private toDocument(user: User): any {
    return {
      name: user.name,
      email: user.email,
      passwordHash: user.passwordHash,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}