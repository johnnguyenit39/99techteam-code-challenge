# Problem 4: Three Ways to Sum to n

**Category:** Backend | Fullstack  
**Duration:** ≤ 2 hours (internship) / significantly less (professional)

## Task

Provide 3 unique implementations of the following function in TypeScript. Comment on the complexity or efficiency of each function.

## Requirements

- **Input:** `n` - any integer
- **Assumption:** This input will always produce a result less than `Number.MAX_SAFE_INTEGER`.
- **Output:** Return the summation to n, i.e., `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## Solution

See [`src/sum-to-n.ts`](./src/sum-to-n.ts) for the three implementations.

### Implementation Approaches

1. **Iterative Approach** (`sum_to_n_a`)
   - Time Complexity: O(n)
   - Space Complexity: O(1)
   - Description: Simple loop that accumulates the sum

2. **Mathematical Formula** (`sum_to_n_b`)
   - Time Complexity: O(1)
   - Space Complexity: O(1)
   - Description: Uses the mathematical formula: n(n+1)/2

3. **Recursive Approach** (`sum_to_n_c`)
   - Time Complexity: O(n)
   - Space Complexity: O(n) due to call stack
   - Description: Recursive solution with base case

## Running the Code

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run with ts-node
npx ts-node src/sum-to-n.ts
```

## Testing

Test cases are available in [`tests/sum-to-n.test.ts`](./tests/sum-to-n.test.ts).

