/**
 * Resource Service
 * Handles all database operations for resources
 */

import { db } from '../config/database';
import { Resource, CreateResourceDto, UpdateResourceDto, ResourceFilters } from '../models/Resource';

export class ResourceService {
    /**
     * Create a new resource
     */
    static create(data: CreateResourceDto): Resource {
        const stmt = db.prepare(`
            INSERT INTO resources (name, description, created_at, updated_at)
            VALUES (?, ?, datetime('now'), datetime('now'))
        `);

        const result = stmt.run(data.name, data.description || null);
        return this.findById(result.lastInsertRowid as number)!;
    }

    /**
     * Find all resources with optional filters
     */
    static findAll(filters: ResourceFilters = {}): Resource[] {
        const { limit = 100, offset = 0, search } = filters;

        let query = 'SELECT * FROM resources';
        const params: any[] = [];

        if (search) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const stmt = db.prepare(query);
        const rows = stmt.all(...params) as any[];

        return rows.map(row => this.mapRowToResource(row));
    }

    /**
     * Find a resource by ID
     */
    static findById(id: number): Resource | null {
        const stmt = db.prepare('SELECT * FROM resources WHERE id = ?');
        const row = stmt.get(id) as any;

        if (!row) {
            return null;
        }

        return this.mapRowToResource(row);
    }

    /**
     * Update a resource
     */
    static update(id: number, data: UpdateResourceDto): Resource | null {
        const existing = this.findById(id);
        if (!existing) {
            return null;
        }

        const updates: string[] = [];
        const params: any[] = [];

        if (data.name !== undefined) {
            updates.push('name = ?');
            params.push(data.name);
        }

        if (data.description !== undefined) {
            updates.push('description = ?');
            params.push(data.description);
        }

        if (updates.length === 0) {
            return existing;
        }

        updates.push('updated_at = datetime(\'now\')');
        params.push(id);

        const stmt = db.prepare(`
            UPDATE resources 
            SET ${updates.join(', ')} 
            WHERE id = ?
        `);

        stmt.run(...params);
        return this.findById(id);
    }

    /**
     * Delete a resource
     */
    static delete(id: number): boolean {
        const stmt = db.prepare('DELETE FROM resources WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }

    /**
     * Count total resources (for pagination)
     */
    static count(filters: ResourceFilters = {}): number {
        const { search } = filters;

        let query = 'SELECT COUNT(*) as count FROM resources';
        const params: any[] = [];

        if (search) {
            query += ' WHERE name LIKE ? OR description LIKE ?';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
        }

        const stmt = db.prepare(query);
        const result = stmt.get(...params) as { count: number };
        return result.count;
    }

    /**
     * Map database row to Resource object
     */
    private static mapRowToResource(row: any): Resource {
        return {
            id: row.id,
            name: row.name,
            description: row.description || undefined,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}

