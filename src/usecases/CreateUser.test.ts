/**
 * Unit Tests for CreateUser Use Case
 */

import { CreateUser } from './CreateUser';
import { IUserRepository } from '../domain/repositories/IUserRepository';
import { User } from '../domain/entities/User';

// Mock repository
class MockUserRepository implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find(u => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(u => u.email === email) || null;
  }

  async findAll(): Promise<User[]> {
    return this.users;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async update(user: User): Promise<User> {
    return user;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }
}

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;
  let mockRepository: MockUserRepository;

  beforeEach(() => {
    mockRepository = new MockUserRepository();
    createUser = new CreateUser(mockRepository);
  });

  it('should create a new user successfully', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    const user = await createUser.execute(dto);

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
    expect(user.id).toBeDefined();
  });

  it('should throw error if email already exists', async () => {
    const dto = {
      name: 'John Doe',
      email: 'john@example.com'
    };

    await createUser.execute(dto);

    await expect(createUser.execute(dto)).rejects.toThrow(
      'User with this email already exists'
    );
  });

  it('should throw error for invalid email format', async () => {
    const dto = {
      name: 'John Doe',
      email: 'invalid-email'
    };

    await expect(createUser.execute(dto)).rejects.toThrow('Invalid email format');
  });

  it('should throw error for invalid name', async () => {
    const dto = {
      name: 'J',
      email: 'john@example.com'
    };

    await expect(createUser.execute(dto)).rejects.toThrow(
      'Name must be at least 2 characters long'
    );
  });
});
