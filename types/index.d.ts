import { GridArray } from './utils';
export default function factory(option: Option): Promise<ConsoleASCII>;
declare class ConsoleASCII {
    #private;
    canvas: HTMLCanvasElement;
    option: Option;
    gridCell: number;
    gridSide: [number, number];
    grid: GridArray;
    gridBeta: Array<number[]>;
    chartSet: string[];
    constructor(option: Option);
    toString(): string;
    onload?(): unknown;
    onerror?(err: unknown): unknown;
}
export {};
