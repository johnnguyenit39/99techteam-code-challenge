/**
 * Problem 5: A Crude Server
 * Entry point for the Express server
 */

import dotenv from 'dotenv';
import { app } from './app';
import { initializeDatabase } from './config/database';

// Load environment variables
dotenv.config();

// Initialize database
initializeDatabase();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`💾 Database initialized`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});

