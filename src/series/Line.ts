import { Bisector } from "../utils/d3";
import { isNumeric, MAX_VALUE, MIN_VALUE } from "../utils/util";

import { Coord } from "../modules/Coord";
import { BaseSeries, IItem } from "./BaseSeries";

const bisect: Bisector<IItem> = new Bisector<IItem>();

export class Line extends BaseSeries {

    public static type: string = "line";

    public priority: number;

    public lineWidth: number;
    public fill: boolean;
    public stair: boolean;

    constructor(config: any) {
        super();
        this.update(config);
    }

    public update(config: any): void {
        super.update(config);

        this.updatePoint(config, "x", true);
        this.updatePoint(config, "y", false);

        this.lineWidth = isNumeric(config.lineWidth) ? config.lineWidth : 1;
        this.fill = config.fill || false;
        this.stair = config.stair || false;

        if (this.fill) {
            this.priority = 2;
        } else {
            this.priority = 1;
        }
    }

    public load(data: any[], calc: any[]): void {
        super.load(data, calc);

        if (data === null) {
            this.minX = null;
            this.minY = null;
            this.maxX = null;
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

            this.minX = this.findValue("x", 0, 1);
            this.maxX = this.findValue("x", data.length - 1, -1);
        }
    }

    public filterColander(quality: number, scale: number): void {
        if (quality === 0) {
            super.filterColander(quality, scale);
            return;
        }

        const filter: IItem[] = [];
        const calc: IItem[] = this.calc;
        const keyX: string = this.point.x.key;
        const keyY: string = this.point.y.key;

        let min: IItem = null;
        let max: IItem = null;
        let last: IItem = null;
        let item: IItem;

        let xValue: number = 0;
        let yValue: number = 0;

        let minValue: number;
        let maxValue: number;

        let firstX: number = MIN_VALUE;

        const ln: number = calc.length;
        let i: number = 0;

        for (; i < ln; ++i) {
            item = calc[i];
            xValue = item[keyX];
            yValue = item[keyY];

            if (xValue === undefined || yValue === undefined) {
                continue;
            }

            if (yValue === null || xValue * scale - firstX > quality) {
                if (min) {
                    if (max) {
                        if (min.$index > max.$index) {
                            filter.push(max);
                            filter.push(min);
                        } else {
                            filter.push(min);
                            filter.push(max);
                        }

                        min = null;
                        max = null;
                    } else {
                        filter.push(min);
                        min = null;
                    }
                } else {
                    if (max) {
                        filter.push(max);
                        max = null;
                    }
                }

                if (last) {
                    filter.push(last);
                    last = null;
                }

                filter.push(item);

                if (yValue === null) {
                    for (++i; i < ln; ++i) {
                        item = calc[i];
                        xValue = item[keyX];
                        yValue = item[keyY];

                        if (xValue !== undefined && yValue !== undefined && yValue !== null) {
                            filter.push(item);
                            break;
                        }
                    }

                    firstX = MIN_VALUE;
                } else {
                    firstX = Math.floor(xValue * scale);
                }

                minValue = yValue;
                maxValue = yValue;
            } else {
                if (yValue < minValue) {
                    minValue = yValue;
                    min = item;
                    last = null;
                } else {
                    if (yValue > maxValue) {
                        maxValue = yValue;
                        max = item;
                        last = null;
                    } else {
                        last = item;
                    }
                }
            }
        }

        if (min) {
            if (max) {
                if (min.$index > max.$index) {
                    filter.push(max);
                    filter.push(min);
                } else {
                    filter.push(min);
                    filter.push(max);
                }

                min = null;
                max = null;
            } else {
                filter.push(min);
                min = null;
            }
        } else {
            if (max) {
                filter.push(max);
                max = null;
            }
        }

        if (last) {
            filter.push(last);
        }

        this.filter = filter;
    }

    public filterBetween(coord: Coord, sizeBody: number[]): void {
        coord.set(this.point.x.key, this.point.y.key);
        bisect.accessor = coord.getX.bind(coord);

        const ln: number = this.filter.length;
        let value: number;

        // -1 потому что нужно взять один элемент за экраном
        value = bisect.left(this.filter, 0) - 1;
        this.start = value < 0 ? 0 : value;

        //  1 потому что нужно взять один элемент за экраном
        value = bisect.right(this.filter, sizeBody[0]) + 1;
        this.finish = value >= ln ? ln - 1 : value;
    }

    public draw(ctx: CanvasRenderingContext2D, coord: Coord): void {
        coord.set(this.point.x.key, this.point.y.key);

        ctx.globalAlpha = this.opacity;
        ctx.lineWidth = this.lineWidth;

        let start: number = this.start - 1;
        const finish: number = this.finish + 1;

        let first: IItem = null;
        let item: IItem;

        let x1: number; // текущий x
        let y0: number; // предыдущий y
        let y1: number; // текущий y

        while (++start < finish) {
            item = this.filter[start];
            x1 = coord.getX(item);
            y1 = coord.getY(item);
            if (y1 !== null) {
                first = item;
                y0 = y1;

                ctx.beginPath();
                ctx.moveTo(x1, y1);
                break;
            }
        }

        for (++start; start < finish; ++start) {
            item = this.filter[start];
            y1 = coord.getY(item);

            if (y1 === null) {
                this.drawEnd(ctx, first, item, coord);
                first = null;

                while (++start < finish) {
                    item = this.filter[start];
                    x1 = coord.getX(item);
                    y1 = coord.getY(item);
                    if (y1 !== null) {
                        first = item;
                        y0 = y1;

                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        break;
                    }
                }

            } else {
                if (this.stair) {
                    x1 = coord.getX(item);
                    ctx.lineTo(x1, y0);
                    ctx.lineTo(x1, y1);
                    y0 = y1;
                } else {
                    ctx.lineTo(coord.getX(item), y1);
                }
            }
        }

        this.drawEnd(ctx, first, item, coord);
    }

    public tooltip(row: HTMLTableRowElement, cell: HTMLTableCellElement, x: number, coord: Coord): void {
        const index: number = this.findTooltipIndex(x, coord);

        if (index === null) {
            row.style.display = "none";
            return;
        }

        if (this.getTooltip) {
            cell.innerHTML = this.getTooltip(this.data[index]).toString();
        } else {
            cell.innerHTML = this.point.y.accessor(this.data[index]).toString();
        }

        row.style.display = "";
    }

    private drawEnd(ctx: CanvasRenderingContext2D, first: IItem, last: IItem, coord: Coord): void {
        if (!first) {
            return;
        }

        if (this.fill) {
            const bottom: number = coord.getHeight() + coord.getTop();
            ctx.lineTo(coord.getX(last), bottom);
            ctx.lineTo(coord.getX(first), bottom);
            ctx.lineTo(coord.getX(first), coord.getY(first));

            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        ctx.strokeStyle = this.color;
        ctx.stroke();
    }

    private findTooltipIndex(x: number, coord: Coord): number {
        coord.set(this.point.x.key, "");
        bisect.accessor = coord.getX.bind(coord);

        let indexLeft: number;
        let indexRight: number;

        let valueLeft: number;
        let valueRight: number;

        let itemLeft: IItem;
        let itemRight: IItem;

        let xLeft: number;
        let xRight: number;

        indexRight = bisect.left(this.filter, x);

        // если x выходит за пределы справа
        if (indexRight >= this.filter.length) {
            return null;
        }

        itemRight = this.filter[indexRight];
        valueRight = this.point.y.accessor(this.data[itemRight.$index]);

        if (valueRight === null) {
            return null;
        }

        xRight = coord.getX(itemRight);
        if (Math.floor(xRight) === x) {
            return itemRight.$index;
        }

        indexLeft = indexRight - 1;

        // если x выходит за пределы слева
        if (indexLeft < 0) {
            return null;
        }

        itemLeft = this.filter[indexLeft];
        valueLeft = this.point.y.accessor(this.data[itemLeft.$index]);

        if (valueLeft === null) {
            return null;
        }

        // при степенчатой отрисовке всегда берем левое значение
        if (this.stair) {
            return itemLeft.$index;
        }

        // при обычной отрисовке берем ближнюю точку
        xLeft = coord.getX(itemLeft);
        return Math.abs(xLeft - x) < Math.abs(xRight - x) ? itemLeft.$index : itemRight.$index;
    }
}
