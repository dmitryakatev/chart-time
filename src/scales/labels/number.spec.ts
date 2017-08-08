import { findFactor } from "./number";

describe("number unit test", () => {
    it("must find a factor", () => {
        const tests: [[number, number]] = [
            [-2581090353458234862,              12],
            [-219012,                           -1],
            [-4,                                -6],
            [-1.52349842314356456,              -6],
            [-1,                                -6],
            [0,                                 -7],
            [0.0000000000000000345234,          -23],
            [0.9652345645623193456767231293445, -7],
            [1,                                 -6],
            [1.14556,                           -6],
            [19,                                -5],
            [346,                               -4],
            [4567,                              -3],
            [786787678.234523454234,            2],
            [740012088064200765534,             14],
        ];

        tests.forEach((test: number[]) => {
            const numIn: number = test[0];
            const numOut: number = test[1];

            const result: number[] = findFactor(numIn);

            expect(result[0]).toBeCloseTo(Math.pow(10, numOut));
            expect(result[1]).toBe(numOut);
        });
    });
});
