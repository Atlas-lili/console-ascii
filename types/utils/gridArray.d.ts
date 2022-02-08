export declare class GridArray {
    row: number;
    col: number;
    length: number;
    buffer: Uint8Array;
    constructor(row?: number, col?: number, length?: number);
    forEach(cb: (value: number, x: number, y: number) => unknown): void;
    pointToOffset(point: {
        x: number;
        y: number;
    }): {
        count: number;
        i: number;
    };
    offsetToPoint(offset: {
        count: number;
        i: number;
    }): {
        y: number;
        x: number;
    };
    toString(): string;
    setPoint(point: {
        x: number;
        y: number;
    }, value: number): void;
    getPoint(point: {
        x: number;
        y: number;
    }): number;
}
