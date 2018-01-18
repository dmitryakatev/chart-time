import { Coord } from "../modules/Coord";
import { ISeries } from "../series/index";
import { isNumeric, MAX_VALUE, MIN_VALUE } from "../utils/util";

export type Calc = (val: number) => number;

export interface IScale {
    type: string;
    key: string;

    color: string;
    opacity: number;
    lineWidth: number;

    min: number;
    max: number;

    coord: number;
    coords: number[];
    labels: string[];

    update: (config: any) => void;
    updateMinAndMax: <T extends keyof ISeries, K extends keyof ISeries>(series: ISeries[], min: T, max: K) => void;
    interpreter: (size: number, invert: boolean) => Calc;
    draw: (ctx: CanvasRenderingContext2D, coord: Coord) => void;
    destroy: () => void;
}

export interface IScaleCtor {
    type: string;
    new(config: any): IScale;
}

export abstract class BaseScale implements IScale {

    public type: string;
    public key: string;

    public color: string;
    public opacity: number;
    public lineWidth: number;

    public minValue: number;
    public maxValue: number;

    public min: number;
    public max: number;

    public coord: number;
    public labels: string[];
    public coords: number[];

    constructor() {
        this.type = Object.getPrototypeOf(this).constructor.type;
    }

    public update(config: any): void {
        this.key = config.key;

        this.color = config.color || "#000000"; // black
        this.opacity = isNumeric(config.opacity) ? config.opacity : 1;
        this.lineWidth = isNumeric(config.lineWidth) ? config.lineWidth : 1;

        this.minValue = isNumeric(config.minValue) ? config.minValue : null;
        this.maxValue = isNumeric(config.maxValue) ? config.maxValue : null;
    }

    public updateMinAndMax<T extends keyof ISeries, K extends keyof ISeries>(series: ISeries[], min: T, max: K): void {
        const ln: number = series.length;

        let value: number;
        let valMin: number = MAX_VALUE;
        let valMax: number = MIN_VALUE;

        let i: number;
        let s: ISeries;

        for (i = 0; i < ln; ++i) {
            s = series[i];

            value = s[min] as number;
            if (isNumeric(value) && value < valMin) {
                valMin = value;
            }

            value = s[max] as number;
            if (isNumeric(value) && value > valMax) {
                valMax = value;
            }
        }

        if (this.minValue === null) {
            this.min = valMin === MAX_VALUE ? null : valMin;
        } else {
            this.min = this.minValue;
        }

        if (this.maxValue === null) {
            this.max = valMax === MIN_VALUE ? null : valMax;
        } else {
            this.max = this.maxValue;
        }
    }

    public interpreter(size: number, invert: boolean): Calc {
        // расчет
        // (max - min)   = size (100%)
        // (val - min) = x
        //
        //       val - min
        //  x = ----------- * size
        //       max - min
        //

        const forCalc: number = size / (this.max - this.min);

        if (invert) {
            return (val: number) => {
                return (val === undefined || val === null) ? val : (size - (val - this.min) * forCalc);
            };
        }

        return (val: number) => {
            return (val === undefined || val === null) ? val : ((val - this.min) * forCalc);
        };
    }

    public abstract draw(ctx: CanvasRenderingContext2D, coord: Coord): void;

    public destroy(): void {
        this.key = null;
    }
}
