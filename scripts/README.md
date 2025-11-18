# Test Scripts

This directory contains automated test scripts for the code challenge problems.

## Scripts

- **`test-all.sh`** - Runs tests for all problems (Problem 4 and Problem 5)
- **`test-problem4.sh`** - Runs automated Jest tests for Problem 4
- **`test-problem5.sh`** - Starts Problem 5 server, tests all CRUD endpoints, then stops the server

## Usage

From the root directory:

```bash
# Test all problems
npm test

# Or run scripts directly
bash scripts/test-all.sh
bash scripts/test-problem4.sh
bash scripts/test-problem5.sh
```

## What Each Script Does

### test-problem4.sh
- Installs dependencies if needed
- Runs Jest test suite
- Validates all three `sum_to_n` implementations

### test-problem5.sh
- Installs dependencies if needed
- Builds the TypeScript project
- Starts the Express server
- Tests all CRUD endpoints:
  - Health check
  - Create resource
  - List resources
  - Get resource by ID
  - Update resource
  - Search resources
  - Pagination
  - Validation errors
  - Not found errors
  - Delete resource
- Stops the server automatically

### test-all.sh
- Runs both test scripts sequentially
- Displays summary of all test results

