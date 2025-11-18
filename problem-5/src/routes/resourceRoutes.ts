/**
 * Resource Routes
 * Defines all routes for resource endpoints
 */

import { Router } from 'express';
import { ResourceController } from '../controllers/resourceController';

const router = Router();

// Create a new resource
router.post('/', ResourceController.create);

// Get all resources with filters
router.get('/', ResourceController.findAll);

// Get a single resource by ID
router.get('/:id', ResourceController.findById);

// Update a resource
router.put('/:id', ResourceController.update);

// Delete a resource
router.delete('/:id', ResourceController.delete);

export default router;

