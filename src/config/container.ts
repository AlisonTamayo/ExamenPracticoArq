/**
 * Dependency Injection Container
 * Wires up all dependencies following the Dependency Inversion Principle
 * This is where we compose our application
 */

import { InMemoryDatabase } from '../infrastructure/database/InMemoryDatabase';
import { UserRepositoryImpl } from '../infrastructure/repositories/UserRepositoryImpl';
import { CreateUser } from '../usecases/CreateUser';
import { GetUser } from '../usecases/GetUser';
import { GetAllUsers } from '../usecases/GetAllUsers';
import { UpdateUser } from '../usecases/UpdateUser';
import { UserController } from '../presentation/controllers/UserController';

export class Container {
  // Infrastructure
  private database: InMemoryDatabase;
  private userRepository: UserRepositoryImpl;

  // Use Cases
  private createUserUseCase: CreateUser;
  private getUserUseCase: GetUser;
  private getAllUsersUseCase: GetAllUsers;
  private updateUserUseCase: UpdateUser;

  // Controllers
  public userController: UserController;

  constructor() {
    // Initialize infrastructure
    this.database = new InMemoryDatabase();
    this.userRepository = new UserRepositoryImpl(this.database);

    // Initialize use cases with dependencies
    this.createUserUseCase = new CreateUser(this.userRepository);
    this.getUserUseCase = new GetUser(this.userRepository);
    this.getAllUsersUseCase = new GetAllUsers(this.userRepository);
    this.updateUserUseCase = new UpdateUser(this.userRepository);

    // Initialize controllers with use cases
    this.userController = new UserController(
      this.createUserUseCase,
      this.getUserUseCase,
      this.getAllUsersUseCase,
      this.updateUserUseCase
    );
  }

  public getDatabase(): InMemoryDatabase {
    return this.database;
  }
}
