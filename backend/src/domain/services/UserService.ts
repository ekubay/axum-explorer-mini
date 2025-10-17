// src/domain/services/UserService.ts
import { User, UserEntity, UserRole } from '../entities/User';
import { IUserRepository } from '../repositories/IUserRepository';
import config from '../../application/config';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserService {
  constructor(private userRepository: IUserRepository) {}

  async registerUser(
    name: string,
    email: string,
    password: string,
    role: UserRole,
    phone?: string
  ): Promise<{ user: User; token: string }> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const passwordHash = await this.hashPassword(password);
    const user = UserEntity.create(name, email, passwordHash, role, phone);
    const savedUser = await this.userRepository.save(user);
    const token = this.generateToken(savedUser);

    return { user: savedUser, token };
  }

  async authenticateUser(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await this.verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Account not verified');
    }

    const token = this.generateToken(user);
    return { user, token };
  }

  async getUserProfile(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, config.auth.bcryptRounds);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.jwtExpiresIn
    } as jwt.SignOptions);
  }
}