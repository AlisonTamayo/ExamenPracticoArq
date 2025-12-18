/**
 * User Repository Implementation (Adapter)
 * Implements the IUserRepository interface
 * Part of the Infrastructure Layer
 * This is the concrete implementation that the domain layer doesn't know about
 */

import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { InMemoryDatabase } from '../database/InMemoryDatabase';

export class UserRepositoryImpl implements IUserRepository {
  constructor(private database: InMemoryDatabase) {}

  async findById(id: string): Promise<User | null> {
    return await this.database.findUserById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.database.findUserByEmail(email);
  }

  async findAll(): Promise<User[]> {
    return await this.database.getAllUsers();
  }

  async save(user: User): Promise<User> {
    return await this.database.saveUser(user);
  }

  async update(user: User): Promise<User> {
    const existingUser = await this.database.findUserById(user.id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    return await this.database.saveUser(user);
  }

  async delete(id: string): Promise<boolean> {
    return await this.database.deleteUser(id);
  }
}
