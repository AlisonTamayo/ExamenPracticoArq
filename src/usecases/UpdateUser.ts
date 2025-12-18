/**
 * Use Case: Update User
 * Updates user information
 * Part of the Use Cases Layer
 */

import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/repositories/IUserRepository';

export interface UpdateUserDTO {
  id: string;
  name: string;
}

export class UpdateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(dto: UpdateUserDTO): Promise<User> {
    // First, get the existing user
    const existingUser = await this.userRepository.findById(dto.id);
    
    if (!existingUser) {
      throw new Error('User not found');
    }

    // Update the user name (entities are immutable, so create new instance)
    const updatedUser = existingUser.updateName(dto.name);

    // Persist the updated user
    return await this.userRepository.update(updatedUser);
  }
}
