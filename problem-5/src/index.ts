/**
 * Problem 5: A Crude Server
 * Entry point for the Express server
 */

import dotenv from 'dotenv';
import { app } from './app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 API endpoints available at http://localhost:${PORT}/api`);
});

