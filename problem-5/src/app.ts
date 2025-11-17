/**
 * Problem 5: A Crude Server
 * Express application setup
 */

import express, { Express, Request, Response, NextFunction } from 'express';

export const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// API routes
// TODO: Implement CRUD routes
// app.use('/api/resources', resourceRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

