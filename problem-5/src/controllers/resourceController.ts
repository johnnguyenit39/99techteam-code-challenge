/**
 * Resource Controller
 * Handles HTTP requests and responses for resource endpoints
 */

import { Request, Response } from 'express';
import { ResourceService } from '../services/resourceService';
import { CreateResourceDto, UpdateResourceDto, ResourceFilters } from '../models/Resource';

export class ResourceController {
    /**
     * Create a new resource
     * POST /api/resources
     */
    static async create(req: Request, res: Response): Promise<void> {
        try {
            const data: CreateResourceDto = req.body;

            // Validation
            if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Name is required and must be a non-empty string'
                });
                return;
            }

            if (data.description && typeof data.description !== 'string') {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Description must be a string'
                });
                return;
            }

            const resource = ResourceService.create({
                name: data.name.trim(),
                description: data.description?.trim(),
            });

            res.status(201).json(resource);
        } catch (error) {
            console.error('Error creating resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Get all resources with optional filters
     * GET /api/resources
     */
    static async findAll(req: Request, res: Response): Promise<void> {
        try {
            const filters: ResourceFilters = {
                limit: req.query.limit ? parseInt(req.query.limit as string, 10) : undefined,
                offset: req.query.offset ? parseInt(req.query.offset as string, 10) : undefined,
                search: req.query.search as string | undefined,
            };

            // Validate limit and offset
            if (filters.limit !== undefined && (isNaN(filters.limit) || filters.limit < 1 || filters.limit > 1000)) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Limit must be between 1 and 1000'
                });
                return;
            }

            if (filters.offset !== undefined && (isNaN(filters.offset) || filters.offset < 0)) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Offset must be a non-negative number'
                });
                return;
            }

            const resources = ResourceService.findAll(filters);
            const total = ResourceService.count(filters);

            res.json({
                data: resources,
                pagination: {
                    total,
                    limit: filters.limit || 100,
                    offset: filters.offset || 0,
                },
            });
        } catch (error) {
            console.error('Error fetching resources:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Get a single resource by ID
     * GET /api/resources/:id
     */
    static async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id < 1) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid resource ID'
                });
                return;
            }

            const resource = ResourceService.findById(id);

            if (!resource) {
                res.status(404).json({
                    error: 'Not found',
                    message: 'Resource not found'
                });
                return;
            }

            res.json(resource);
        } catch (error) {
            console.error('Error fetching resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Update a resource
     * PUT /api/resources/:id
     */
    static async update(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id < 1) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid resource ID'
                });
                return;
            }

            const data: UpdateResourceDto = req.body;

            // Validation
            if (data.name !== undefined) {
                if (typeof data.name !== 'string' || data.name.trim().length === 0) {
                    res.status(400).json({
                        error: 'Validation error',
                        message: 'Name must be a non-empty string'
                    });
                    return;
                }
            }

            if (data.description !== undefined && typeof data.description !== 'string') {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Description must be a string'
                });
                return;
            }

            // Check if resource exists
            const existing = ResourceService.findById(id);
            if (!existing) {
                res.status(404).json({
                    error: 'Not found',
                    message: 'Resource not found'
                });
                return;
            }

            const updateData: UpdateResourceDto = {};
            if (data.name !== undefined) {
                updateData.name = data.name.trim();
            }
            if (data.description !== undefined) {
                updateData.description = data.description.trim();
            }

            const resource = ResourceService.update(id, updateData);

            if (!resource) {
                res.status(404).json({
                    error: 'Not found',
                    message: 'Resource not found'
                });
                return;
            }

            res.json(resource);
        } catch (error) {
            console.error('Error updating resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    /**
     * Delete a resource
     * DELETE /api/resources/:id
     */
    static async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = parseInt(req.params.id, 10);

            if (isNaN(id) || id < 1) {
                res.status(400).json({
                    error: 'Validation error',
                    message: 'Invalid resource ID'
                });
                return;
            }

            const deleted = ResourceService.delete(id);

            if (!deleted) {
                res.status(404).json({
                    error: 'Not found',
                    message: 'Resource not found'
                });
                return;
            }

            res.status(204).send();
        } catch (error) {
            console.error('Error deleting resource:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

