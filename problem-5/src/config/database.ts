/**
 * Database Configuration
 * Sets up and initializes the SQLite database
 */

import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../data', 'database.db');
const dbDir = path.dirname(DB_PATH);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
export const db: DatabaseType = new Database(DB_PATH);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create resources table if it doesn't exist
export function initializeDatabase(): void {
    db.exec(`
        CREATE TABLE IF NOT EXISTS resources (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        );

        CREATE INDEX IF NOT EXISTS idx_resources_name ON resources(name);
        CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);
    `);

    console.log('✅ Database initialized successfully');
}

// Close database connection
export function closeDatabase(): void {
    db.close();
}

