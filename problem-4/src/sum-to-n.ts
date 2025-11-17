/**
 * Problem 4: Three Ways to Sum to n
 * 
 * Three unique implementations of sum_to_n function with different approaches
 * and complexity analysis.
 */

/**
 * Implementation A: Iterative Approach
 * 
 * Time Complexity: O(n) - Linear time, iterates through all numbers from 1 to n
 * Space Complexity: O(1) - Constant space, only uses a few variables
 * 
 * This is a straightforward approach that loops through all numbers and accumulates the sum.
 * Best for: Readability and when n is not extremely large
 */
export function sum_to_n_a(n: number): number {
    if (n <= 0) return 0;

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
}

/**
 * Implementation B: Mathematical Formula
 * 
 * Time Complexity: O(1) - Constant time, single calculation
 * Space Complexity: O(1) - Constant space
 * 
 * Uses the mathematical formula: n(n+1)/2
 * This is the most efficient approach as it requires only a single calculation.
 * Best for: Performance-critical scenarios
 */
export function sum_to_n_b(n: number): number {
    if (n <= 0) return 0;
    return (n * (n + 1)) / 2;
}

/**
 * Implementation C: Recursive Approach
 * 
 * Time Complexity: O(n) - Linear time, makes n recursive calls
 * Space Complexity: O(n) - Linear space due to call stack depth
 * 
 * Recursive solution that breaks down the problem into smaller subproblems.
 * Note: For large values of n, this may cause stack overflow.
 * Best for: Educational purposes and when n is small
 */
export function sum_to_n_c(n: number): number {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
}

// Example usage and testing
if (require.main === module) {
    const testCases = [5, 10, 100, 0, -5];

    console.log("Testing sum_to_n implementations:\n");

    testCases.forEach(n => {
        console.log(`n = ${n}:`);
        console.log(`  sum_to_n_a(${n}) = ${sum_to_n_a(n)}`);
        console.log(`  sum_to_n_b(${n}) = ${sum_to_n_b(n)}`);
        console.log(`  sum_to_n_c(${n}) = ${sum_to_n_c(n)}`);
        console.log();
    });
}

