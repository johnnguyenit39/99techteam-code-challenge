import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from '../src/sum-to-n';

describe('sum_to_n', () => {
    const testCases = [
        { n: 5, expected: 15 },
        { n: 10, expected: 55 },
        { n: 100, expected: 5050 },
        { n: 1, expected: 1 },
        { n: 0, expected: 0 },
        { n: -5, expected: 0 },
    ];

    test.each(testCases)('sum_to_n_a($n) should return $expected', ({ n, expected }) => {
        expect(sum_to_n_a(n)).toBe(expected);
    });

    test.each(testCases)('sum_to_n_b($n) should return $expected', ({ n, expected }) => {
        expect(sum_to_n_b(n)).toBe(expected);
    });

    test.each(testCases)('sum_to_n_c($n) should return $expected', ({ n, expected }) => {
        expect(sum_to_n_c(n)).toBe(expected);
    });

    it('all implementations should return the same result', () => {
        const testValues = [5, 10, 50, 100];
        testValues.forEach(n => {
            const resultA = sum_to_n_a(n);
            const resultB = sum_to_n_b(n);
            const resultC = sum_to_n_c(n);
            expect(resultA).toBe(resultB);
            expect(resultB).toBe(resultC);
        });
    });
});

