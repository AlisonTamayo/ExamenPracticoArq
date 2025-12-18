/**
 * Application Entry Point
 * Sets up the Express application with routes and middleware
 */

import express, { Application, Request, Response } from 'express';
import { Container } from './config/container';
import { createUserRoutes } from './presentation/routes/userRoutes';

export function createApp(): Application {
  const app = express();
  const container = new Container();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.get('/', (_req: Request, res: Response) => {
    res.json({
      message: 'Examen Practico de Arquitectura - Clean Architecture Demo',
      endpoints: {
        users: {
          create: 'POST /api/users',
          getAll: 'GET /api/users',
          getById: 'GET /api/users/:id',
          update: 'PUT /api/users/:id'
        }
      }
    });
  });

  app.use('/api/users', createUserRoutes(container.userController));

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}
