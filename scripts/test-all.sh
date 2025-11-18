#!/bin/bash

# Test script for all problems
# This script runs tests for problem 4 and problem 5

set -e  # Exit on error

echo "========================================="
echo "Running All Tests"
echo "========================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# Test Problem 4
echo ""
bash "$SCRIPT_DIR/test-problem4.sh"
PROBLEM4_EXIT=$?

# Test Problem 5
echo ""
bash "$SCRIPT_DIR/test-problem5.sh"
PROBLEM5_EXIT=$?

echo ""
echo "========================================="
echo "Final Results"
echo "========================================="
echo ""

if [ $PROBLEM4_EXIT -eq 0 ]; then
    echo "✅ Problem 4: PASSED"
else
    echo "❌ Problem 4: FAILED"
fi

if [ $PROBLEM5_EXIT -eq 0 ]; then
    echo "✅ Problem 5: PASSED"
else
    echo "❌ Problem 5: FAILED"
fi

echo ""

if [ $PROBLEM4_EXIT -eq 0 ] && [ $PROBLEM5_EXIT -eq 0 ]; then
    echo "🎉 All tests passed!"
    exit 0
else
    echo "⚠️  Some tests failed"
    exit 1
fi

