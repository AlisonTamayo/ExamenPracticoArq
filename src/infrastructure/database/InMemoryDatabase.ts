/**
 * In-Memory Database
 * Simple in-memory storage for demonstration purposes
 * Part of the Infrastructure Layer
 */

import { User } from '../../domain/entities/User';

export class InMemoryDatabase {
  private users: Map<string, User> = new Map();

  async saveUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async findUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async clear(): Promise<void> {
    this.users.clear();
  }
}
