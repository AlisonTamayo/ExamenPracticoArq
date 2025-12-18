/**
 * Repository Interface (Port)
 * Defines the contract for data access operations
 * Part of the Domain Layer - defines what operations are needed without implementation details
 * This follows the Dependency Inversion Principle
 */

import { User } from '../entities/User';

export interface IUserRepository {
  /**
   * Find a user by their unique identifier
   */
  findById(id: string): Promise<User | null>;

  /**
   * Find a user by email address
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Get all users in the system
   */
  findAll(): Promise<User[]>;

  /**
   * Save a new user to the repository
   */
  save(user: User): Promise<User>;

  /**
   * Update an existing user
   */
  update(user: User): Promise<User>;

  /**
   * Delete a user by their identifier
   */
  delete(id: string): Promise<boolean>;
}
