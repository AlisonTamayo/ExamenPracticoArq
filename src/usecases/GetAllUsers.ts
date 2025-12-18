/**
 * Use Case: Get All Users
 * Retrieves all users from the repository
 * Part of the Use Cases Layer
 */

import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export class GetAllUsers {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
}
