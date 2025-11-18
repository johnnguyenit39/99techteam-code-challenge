#!/bin/bash

# Test script for Problem 4: Three Ways to Sum to n
# This script runs the automated tests for problem 4

set -e  # Exit on error

echo "========================================="
echo "Testing Problem 4: Three Ways to Sum to n"
echo "========================================="
echo ""

cd "$(dirname "$0")/../problem-4"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --silent
fi

echo "🧪 Running tests..."
echo ""

# Run tests
npm test

echo ""
echo "✅ Problem 4 tests completed successfully!"
echo ""

