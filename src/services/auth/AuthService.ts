import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { User } from '../../models/User';
import { logger } from '../../utils/logger';
import { AppError } from '../../middleware/errorHandler';

export class AuthService {
  async register(data: any): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    logger.info(`Registering new user: ${data.email}`);

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user: User = {
      id: uuidv4(),
      email: data.email,
      password: hashedPassword,
      username: data.username,
      displayName: data.displayName || data.username,
      role: 'user',
      verificationStatus: 'none',
      reputation: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Mock implementation - save user to database

    // Generate tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>; accessToken: string; refreshToken: string }> {
    logger.info(`Login attempt for: ${email}`);

    // Mock implementation - fetch user from database
    // For now, throw error as no users exist
    throw new AppError('Invalid credentials', 401);
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    logger.info('Refreshing token');

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      // Mock implementation - fetch user from database
      const user = { id: decoded.id, email: decoded.email, role: decoded.role };

      const newAccessToken = this.generateAccessToken(user as User);
      const newRefreshToken = this.generateRefreshToken(user as User);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      throw new AppError('Invalid refresh token', 401);
    }
  }

  async logout(refreshToken: string): Promise<void> {
    logger.info('Logging out user');
    // Mock implementation - invalidate refresh token
  }

  private generateAccessToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        verificationType: user.verificationType
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );
  }
}
