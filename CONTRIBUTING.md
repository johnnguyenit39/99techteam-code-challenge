# Contributing / Development Guide

This repository contains solutions to the 99techteam code challenge.

## Repository Structure

```
.
├── README.md              # Main overview and navigation
├── problem-4/            # Three Ways to Sum to n
├── problem-5/            # A Crude Server (Express API)
└── problem-6/            # Architecture Documentation
```

## Getting Started

Each problem is self-contained. Navigate to the problem directory and follow its README.

### Problem 4
```bash
cd problem-4
npm install
npm test
```

### Problem 5
```bash
cd problem-5
npm install
cp .env.example .env
npm run dev
```

### Problem 6
Read the documentation in `problem-6/README.md`

## Code Style

- Use TypeScript for all implementations
- Follow ESLint configuration
- Write tests for all code
- Document complex logic

## Testing

Run tests for each problem:
- Problem 4: `cd problem-4 && npm test`
- Problem 5: `cd problem-5 && npm test`

