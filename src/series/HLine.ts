import { isNumeric, MAX_VALUE, MIN_VALUE } from "../utils/util";

import { Coord } from "../modules/Coord";
import { BaseSeries, IItem, Accessor } from "./BaseSeries";

export class HLine extends BaseSeries {

    public static tooltipValues: { [propName: string]: (list: IItem[], accessor: Accessor) => string } = {
        first: (list: IItem[], accessor: Accessor): string => {
            const value: number = accessor(list[0]);
            return value === null ? "" : value.toString();
        },
        last: (list: IItem[], accessor: Accessor): string => {
            const value: number = accessor(list[list.length - 1]);
            return value === null ? "" : value.toString();
        },
        concat: (list: IItem[], accessor: Accessor): string => {
            const values: number[] = [];

            list.forEach((item: IItem) => {
                const value: number = accessor(item);
                if (value !== null) {
                    values.push(value);
                }
            });

            return values.join(", ");
        },
    };

    public static type: string = "hline";

    public priority: number = 0;

    public lineWidth: number;
    public tooltipValue: string;

    constructor(config: any) {
        super();
        this.update(config);

        this.minX = null;
        this.maxX = null;
    }

    public update(config: any): void {
        super.update(config);

        this.updatePoint(config, "y", false);

        this.lineWidth = isNumeric(config.lineWidth) ? config.lineWidth : 1;
        this.tooltipValue = HLine.tooltipValues.hasOwnProperty(config.tooltip) ? config.tooltip : "first";
    }

    public load(data: any[], calc: any[]): void {
        super.load(data, calc);

        if (data === null) {
            this.minY = null;
            this.maxY = null;
        } else {
            let val: number;
            let min: number = MAX_VALUE;
            let max: number = MIN_VALUE;

            for (let i: number = 0, ln: number = data.length; i < ln; ++i) {
                val = this.point.y.accessor(data[i]);

                if (isNumeric(val)) {
                    if (val > max) {
                        max = val;
                    }

                    if (val < min) {
                        min = val;
                    }
                }
            }

            this.minY = min === MAX_VALUE ? null : min;
            this.maxY = max === MIN_VALUE ? null : max;
        }
    }

    public draw(ctx: CanvasRenderingContext2D, coord: Coord): void {
        coord.set("", this.point.y.key);

        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;

        let start: number = this.start;
        const finish: number = this.finish + 1;

        let y: number;
        const width: number = coord.getWidth();

        ctx.beginPath();

        for (start; start < finish; ++start) {
            y = coord.getY(this.filter[start]);

            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();
    }

    public tooltip(row: HTMLTableRowElement, cell: HTMLTableCellElement, x: number, coord: Coord): void {
        const value: string = this.findTooltipValue();

        if (value === null) {
            row.style.display = "none";
        } else {
            row.style.display = "";
            cell.innerHTML = value.toString();
        }
    }

    private findTooltipValue(): string {
        return HLine.tooltipValues[this.tooltipValue](this.filter, this.point.y.accessor);
    }
}
