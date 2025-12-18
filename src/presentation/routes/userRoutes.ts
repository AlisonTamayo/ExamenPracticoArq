/**
 * User Routes
 * Defines HTTP routes for user operations
 * Part of the Presentation Layer
 */

import { Router } from 'express';
import { UserController } from '../controllers/UserController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // POST /api/users - Create a new user
  router.post('/', (req, res) => userController.createUser(req, res));

  // GET /api/users - Get all users
  router.get('/', (req, res) => userController.getAllUsers(req, res));

  // GET /api/users/:id - Get a specific user
  router.get('/:id', (req, res) => userController.getUser(req, res));

  // PUT /api/users/:id - Update a user
  router.put('/:id', (req, res) => userController.updateUser(req, res));

  return router;
}
