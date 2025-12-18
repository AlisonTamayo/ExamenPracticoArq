/**
 * Use Case: Create User
 * Contains application-specific business rules
 * Part of the Use Cases Layer (Application Layer)
 * Orchestrates the flow of data to and from entities
 */

import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export interface CreateUserDTO {
  name: string;
  email: string;
}

export class CreateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: CreateUserDTO): Promise<User> {
    // Business rule: Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new user entity with generated ID
    const userId = this.generateId();
    const user = new User(
      userId,
      dto.name,
      dto.email,
      new Date()
    );

    // Persist the user
    return await this.userRepository.save(user);
  }

  private generateId(): string {
    // Simple ID generation - in production, use UUID library
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }
}
