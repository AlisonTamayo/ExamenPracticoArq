/**
 * User Controller
 * Handles HTTP requests and responses
 * Part of the Presentation Layer (outermost layer)
 * Depends on use cases, not on implementation details
 */

import { Request, Response } from 'express';
import { CreateUser } from '../../usecases/CreateUser';
import { GetUser } from '../../usecases/GetUser';
import { GetAllUsers } from '../../usecases/GetAllUsers';
import { UpdateUser } from '../../usecases/UpdateUser';

export class UserController {
  constructor(
    private createUserUseCase: CreateUser,
    private getUserUseCase: GetUser,
    private getAllUsersUseCase: GetAllUsers,
    private updateUserUseCase: UpdateUser
  ) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name, email } = req.body;

      if (!name || !email) {
        res.status(400).json({ error: 'Name and email are required' });
        return;
      }

      const user = await this.createUserUseCase.execute({ name, email });
      res.status(201).json(user.toJSON());
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await this.getUserUseCase.execute(id);
      res.status(200).json(user.toJSON());
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users.map(user => user.toJSON()));
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name } = req.body;

      if (!name) {
        res.status(400).json({ error: 'Name is required' });
        return;
      }

      const user = await this.updateUserUseCase.execute({ id, name });
      res.status(200).json(user.toJSON());
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
