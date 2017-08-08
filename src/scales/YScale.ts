import { ISettings } from "../ChartTime";
import { updateLabels } from "./labels/yLabel";

import { ISeries } from "../series/index";
import { Coord } from "../modules/Coord";
import { ctxTest } from "../utils/util";
import { BaseScale, IScale } from "./BaseScale";

export class YScale extends BaseScale {

    public static type: string = "yscale";

    public static updateTicks(scales: IScale[], sizeBody: number[], settings: ISettings, mirror: IScale): void {
        this.updateLabels(scales, sizeBody, settings);
        this.updateXCoords(scales, sizeBody, settings, mirror);
        this.updateYCoords(scales, sizeBody, settings);
    }

    private static id: number = 0;

    private static updateXCoords(scales: IScale[], sizeBody: number[], settings: ISettings, mirror: IScale): void {
        ctxTest.font = settings.sizeText + "px " + settings.font;

        function sort(scale1: YScale, scale2: YScale) {
            return scale1.index - scale2.index;
        }

        let groupScalesLeft: YScale[] = (scales as YScale[]).filter((scale: YScale) => {
            return !scale.right;
        }).sort(sort);

        let groupScalesRigth: YScale[] = (scales as YScale[]).filter((scale: YScale) => {
            return scale.right;
        }).sort(sort);

        if (groupScalesLeft.length === 0) {
            this.setMirrorScale(mirror as YScale, groupScalesRigth[0]);
            groupScalesLeft = [mirror as YScale];
            scales.push(mirror);
        } else {
            if (groupScalesRigth.length === 0) {
                this.setMirrorScale(mirror as YScale, groupScalesLeft[0]);
                groupScalesRigth = [mirror as YScale];
                scales.push(mirror);
            }
        }

        this.updateGroupXCoords(groupScalesLeft, 1);
        this.updateGroupXCoords(groupScalesRigth, -sizeBody[0] + 1);
    }

    private static updateGroupXCoords(scales: YScale[], margin: number): void {
        const ln: number = scales.length;
        let scale: YScale;
        let i: number = 0;

        let label: string;
        let index: number;

        for (; i < ln; ++i) {
            scale = scales[i];

            scale.coord = Math.abs(margin);

            if (scale.title) {
                index = scale.labels.length - 1;
                label = scale.labels[index];

                scale.labels[index] = scale.right ? (scale.title + "  " + label) : (label + "  " + scale.title);
            }

            margin += ctxTest.measureText(scale.labels[scale.labels.length - 1]).width + 20;
        }
    }

    private static updateYCoords(scales: IScale[], sizeBody: number[], settings: ISettings): void {
        const countTicks: number = scales[0].labels.length;
        const bodyHeight: number = sizeBody[1];

        const coords: number[] = new Array(countTicks);
        const heightTick: number = bodyHeight / (countTicks - 1);

        let coord: number = bodyHeight + settings.margin;
        let ln: number;
        let i: number;

        for (i = 0, ln = countTicks; i < ln; ++i) {
            coords[i] = coord;
            coord -= heightTick;
        }

        for (i = 0, ln = scales.length; i < ln; ++i) {
            scales[i].coords = coords;
        }
    }

    private static updateLabels(scales: IScale[], sizeBody: number[], settings: ISettings): void {
        // минимальное расстояние между рисками
        const minHeightTicks: number = settings.minHeightTicks;

        // максимально допустимое кол-во рисок
        const maxCount: number = 50;

         // "сырое" значение кол-ва рисок (будем подбирать оптимальный вариант)
        let rawCount: number = Math.floor(sizeBody[1] / minHeightTicks);

        if (rawCount > maxCount) {
            rawCount = maxCount;
        } else if (rawCount < 2) {
            rawCount = 2;
        }

        updateLabels(scales, rawCount);
    }

    private static setMirrorScale(mirror: YScale, scale: YScale): void {
        mirror.key = scale.key;
        mirror.min = scale.min;
        mirror.max = scale.max;

        mirror.title = scale.title;
        mirror.right = !scale.right; // !!! opposite
        mirror.labels = scale.labels.map((label: string) => {
            return label;
        });
    }

    public right: boolean;
    public title: string;
    public index: number;
    public show: boolean;

    public id: string;

    constructor(config: any) {
        super();
        this.id = (++YScale.id).toString();
        this.update(config);
    }

    public update(config: any): void {
        super.update(config);

        this.right = config.right || false;
        this.title = config.title || null;
        this.index = config.index || 0;
        this.show = config.show !== false;
    }

    public updateMinAndMax<T extends keyof ISeries, K extends keyof ISeries>(series: ISeries[], min: T, max: K): void {
        super.updateMinAndMax(series, min, max);

        if (this.min === null) { // and scale.max === null
            this.min = 0;
            this.max = 1;
        } else {
            if (this.min === this.max) {
                if (this.min < 0) {
                    this.max = 0;
                } else if (this.min === 0) {
                    this.max = 1;
                } else {
                    this.min = 0;
                }
            }
        }
    }

    public draw(ctx: CanvasRenderingContext2D, coord: Coord): void {
        ctx.beginPath();

        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.textAlign = this.right ? "end" : "start";
        ctx.fillStyle = "black";
        ctx.textBaseline = "bottom";

        ctx.moveTo(this.coord, this.coords[0]); // coord.getTop()
        ctx.lineTo(this.coord, this.coords[this.coords.length - 1]);

        const direction: number = (this.right ? -1 : 1) * 5;
        const ln: number = this.coords.length;
        let yCoord: number;

        for (let i: number = 0; i < ln; ++i) {
            yCoord = this.coords[i];

            ctx.moveTo(this.coord, yCoord);
            ctx.lineTo(this.coord + direction, yCoord);
            ctx.fillText(this.labels[i], this.coord + direction, yCoord - 4);
        }

        ctx.stroke();
    }

    public destroy(): void {
        super.destroy();
        this.title = null;
        this.id = null;
    }
}
