import { Bisector } from "../utils/d3";

import { Coord } from "../modules/Coord";
import { BaseSeries, IItem } from "./BaseSeries";

const bisect: Bisector<IItem> = new Bisector<IItem>();
const coordFinish: Coord = new Coord();

const X_SCALE_NANE: string = "yscale_" + Math.random().toString(36).substr(2, 8);

export class Rect extends BaseSeries {

    public static type: string = "rect";

    public priority: number = 3;

    constructor(config: any) {
        super();
        this.update(config);

        this.minY = null;
        this.maxY = null;
    }

    public update(config: any): void {
        super.update(config);

        this.updatePoint(config, "start", true);
        this.updatePoint(config, "finish", true);

        this.scale = X_SCALE_NANE;
    }

    public load(data: any[], calc: any[]): void {
        super.load(data, calc);

        if (data === null) {
            this.minX = null;
            this.maxX = null;
        } else {
            this.minX = this.findValue("start", 0, 1);
            this.maxX = this.findValue("finish", data.length - 1, -1);
        }
    }

    public filterBetween(coord: Coord, sizeBody: number[]): void {
        bisect.accessor = coord.getX.bind(coord);

        const ln: number = this.filter.length;
        let value: number;

        coord.set(this.point.finish.key, "");
        this.start = bisect.left(this.filter, 0);

        coord.set(this.point.start.key, "");
        value = bisect.right(this.filter, coord.getWidth());
        this.finish = value >= ln ? ln - 1 : value;
    }

    public draw(ctx: CanvasRenderingContext2D, coordStart: Coord): void {
        coordStart.copyProps(coordFinish); //  TODO !!
        coordStart.set(this.point.start.key, "");
        coordFinish.set(this.point.finish.key, "");

        let start: number = this.start;
        const finish: number = this.finish + 1;
        let item: IItem;

        let valX1: number;
        let valX2: number;

        const top: number = coordStart.getTop();
        const bottom: number = coordStart.getHeight();

        ctx.beginPath();

        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        for (start; start < finish; ++start) {
            item = this.filter[start];

            valX1 = coordStart.getX(item);
            valX2 = coordFinish.getX(item);

            ctx.fillRect(valX1, top, valX2 - valX1, bottom);
        }

        ctx.stroke();
    }

    public tooltip(row: HTMLTableRowElement, cell: HTMLTableCellElement, x: number, coord: Coord): void {
        const value: boolean = this.findTooltipValue(x, coord);

        if (cell.style.display !== "none") {
            cell.style.display = "none";
            row.children[0].setAttribute("colspan", "2");
        }

        row.style.display = value ? "" : "none";
    }

    private findTooltipValue(x: number, coord: Coord): boolean {
        coord.set(this.point.finish.key, "");
        bisect.accessor = coord.getX.bind(coord);

        const index: number = bisect.left(this.filter, x);

        if (index >= this.filter.length) {
            return false;
        }

        coord.set(this.point.start.key, "");
        return coord.getX(this.filter[index]) <= x;
    }
}
