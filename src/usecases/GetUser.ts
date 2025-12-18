/**
 * Use Case: Get User
 * Retrieves user information
 * Part of the Use Cases Layer
 */

import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export class GetUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
