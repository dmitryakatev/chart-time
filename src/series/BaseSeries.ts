import { Coord } from "../modules/Coord";
import { isEnablePrintWarn } from "../modules/PrintWarn";

import { isNumeric } from "../utils/util";

export type Accessor = (data: any) => number;

export interface IItemRaw {
    [propName: string]: any;
}

export interface IItem {
    [propName: string]: number;
}

export interface ISeries {
    id: string;
    type: string;
    priority: number;
    point: {[propName: string]: IPoint};

    title: string;
    show: boolean;
    source: string;
    color: string;
    opacity: number;
    scale: string;

    data: IItemRaw[];
    calc: IItem[];
    filter: IItem[];
    filterScale: number;

    start: number;
    finish: number;

    minX: number;
    minY: number;
    maxX: number;
    maxY: number;

    update: (config: any) => void;
    load: (data: any[], calc: any[]) => void;

    filterColander: (quality: number, scale: number) => void;
    filterBetween: (coord: Coord, sizeBody: number[]) => void;

    draw: (ctx: CanvasRenderingContext2D, coord: Coord) => void;
    tooltip: (row: HTMLTableRowElement, cell: HTMLTableCellElement, x: number, coord: Coord) => void;
    destroy: () => void;
}

export interface IPoint {
    key?: string; // ???? todo!!!
    path: string;
    accessor: Accessor;
    isDate: boolean;
}

export interface ISeriesCtor {
    type: string;
    new(): ISeries;
}

export abstract class BaseSeries implements ISeries {

    private static id: number = 0;

    public id: string;
    public type: string;
    public priority: number;
    public point: {[propName: string]: IPoint};

    public title: string;
    public show: boolean;
    public source: string;
    public color: string;
    public opacity: number;
    public scale: string;
    public getTooltip: (data: any) => any;

    public data: any[];
    public calc: any[];
    public filter: any[];
    public filterScale: number;

    public start: number;
    public finish: number;

    public minX: number;
    public minY: number;
    public maxX: number;
    public maxY: number;

    constructor() {
        this.id = (++BaseSeries.id).toString(36);
        this.type = Object.getPrototypeOf(this).constructor.type;
        this.point = {};
    }

    public update(config: any): void {
        this.title = config.title;
        this.show = config.show !== false;
        this.source = config.source;
        this.color = config.color;
        this.opacity = isNumeric(config.opacity) ? config.opacity : 1;
        this.scale = config.scale;
        this.getTooltip = config.tooltip ? this.createAccessor(config.tooltip) : null;
    }

    public load(data: any[], calc: any[]): void {
        this.data = data;
        this.calc = calc;

        this.filterScale = -1;
    }

    public filterColander(quality: number, scale: number): void {
        const filter: IItem[] = [];
        const keys: string[] = Object.keys(this.point).map((key) => {
            return this.point[key].key;
        });

        const lnI: number = this.calc.length;
        const lnJ: number = keys.length;

        let i: number;
        let j: number;

        let item: IItem;
        let isNum: boolean;

        for (i = 0; i < lnI; ++i) {
            item = this.calc[i];
            isNum = true;

            for (j = 0; j < lnJ; ++j) {
                if (item[keys[j]] === undefined) {
                    isNum = false;
                    break;
                }
            }

            if (isNum) {
                filter.push(item);
            }
        }

        this.filter = filter;
    }

    public filterBetween(coord: Coord, sizeBody: number[]): void {
        this.start = 0;
        this.finish = this.filter.length - 1;
    }

    public abstract draw(ctx: CanvasRenderingContext2D, coord: Coord): void;
    public abstract tooltip(row: HTMLTableRowElement, cell: HTMLTableCellElement, x: number, coord: Coord): void;

    public destroy(): void {
        this.id = null;
        this.type = null;
        this.point = null;

        this.data = null;
        this.calc = null;
        this.filter = null;
    }

    protected findValue(key: string, start: number, direction: number): number {
        const ln: number = this.data.length;
        let i: number = start;
        let v: number;

        if (direction > 0) {
            for (; i < ln; ++i) {
                v = this.point[key].accessor(this.data[i]);
                if (isNumeric(v)) {
                    return v;
                }
            }
        } else {
            for (; i >= 0; --i) {
                v = this.point[key].accessor(this.data[i]);
                if (isNumeric(v)) {
                    return v;
                }
            }
        }

        return null;
    }

    protected updatePoint(config: any, key: string, isX: boolean): void {
        if (!this.point.hasOwnProperty(key) || this.point[key].path !== config[key]) {
            this.point[key] = {
                path: config[key],
                accessor: this.createAccessor(config[key], isX),
                isDate: isX,
            };
        }
    }

    protected createAccessor(path: string, isDate: boolean = false): Accessor {
        const reg: RegExp = /^\d+$/;
        path = "data[" + path.split(".").map((propName: string) => {
            return reg.test(propName) ? propName : "\"" + propName + "\"";
        }).join("][") + "]";

        if (isDate) {
            path += ".getTime()";
        }

        return new Function("data", `try { return ${path}; } catch (e) { return undefined; }`) as Accessor;
    }
}
