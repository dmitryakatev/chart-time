import { isEnablePrintWarn } from "./modules/PrintWarn";

import { Legend } from "./modules/Legend";
import { Tooltip } from "./modules/Tooltip";

import { Widget, IConfig } from "./modules/Widget";
import { Button, IButtonCtor } from "./modules/buttons/Button";

import { XScale } from "./scales/XScale";
import { YScale } from "./scales/YScale";

import { Calc, IScale, updateScales } from "./scales/index";
import { IItem, IItemRaw, IPoint, ISeries, updateSeries } from "./series/index";

import { Drag } from "./modules/Drag";
import { Coord } from "./modules/Coord";
import { toGroup, toMap } from "./utils/group";
import { mergeIf, delay, formatDate, formatTime } from "./utils/util";

import "./less/chartTime.less";

interface IInterpritar {
    [propName: string]: Calc;
}

interface IAccumulate {
    calc: Calc;
    point: IPoint;
}

const X_SCALE_NANE: string = "xscale_" + Math.random().toString(36).substr(2, 8);
const coordChartTime = new Coord(); // TODO !!!

export class ChartTime extends Widget {

    public static config: IConfig = {
        width: 400,
        height: 300,
        disableRedraw: false,
        legend: {
            buttons: ["damage", "full"],
            tooltip: {
                showDelay: 1000,
                hideDelay: 3000,
                saveDelay: 1000,
            },
        },
        tooltip: {},
        // events: {
        //     onChangeScale?: (instance: ChartTime) => any;
        //     onChangeOffset?: (instance: ChartTime) => any;
        //     onChangeWidthLegend?: (instance: ChartTime) => any;
        //     onChangeTooltip?: (instance: ChartTime) => any;
        //     onChangeTimeLine?: (instance: ChartTime) => any;
        //     onChangeSetting?: (instance: ChartTime) => any;
        //     onDblClick?: (instance: ChartTime) => any;
        // },
    };

    public static settings: IConfig = {
        margin: 20,
        sizeText: 10,
        font: "sans-serif",
        colorText: "black",
        minHeightTicks: 30,
        filterQuality: 1,
        hypersensitivity: 5,
        usePointerLine: true,
        useTimeLine: true,
    };

    public static template: string = [
        "<div class=\"chart-time\">",
            "<div class=\"chart-time-content\">",
                "<div class=\"chart-time-content-wrap\">",
                    "<canvas></canvas>",
                    "<div class=\"chart-time-line chart-time-line-pointer\"></div>",
                    "<div class=\"chart-time-line chart-time-line-time\" style=\"display: none;\"></div>",
                "</div>",
                "<div class=\"chart-time-content-wrap chart-time-content-wrap-event\"></div>",
            "</div>",
        "</div>",
    ].join("");

    public static buttons: { [propName: string]: IButtonCtor } = {};

    public static injectBtn(name: string, ctor: IButtonCtor): void {
        ChartTime.buttons[name] = ctor;
    }

    public type: string = "chartTime";

    public offset: number;          // смещение (сдвиг слева)
    public scale: number;           // масштаб

    public source: any;             // источник данных (он здесь не нужен, данные будут храниться в сериях)
    public series: ISeries[];       // список серий
    public scales: IScale[];        // список шкал по оси Y

    public xScalesToDraw: IScale[]; // шкалы для отображения по оси X (будет 1 шкала, но храним как множество)
    public yScalesToDraw: IScale[]; // шкалы для отображения по оси Y (фильтр от поля this.scales)

    public settings: any;           // найстройки отображения на канвасе (отступ, шрифт, размер текста, ...)

    public dragDrop: Drag;

    public legend: Legend;          // легенда
    public tooltip: Tooltip;        // тултип

    private defaultScale: IScale;   // когда все серии выключены
    private mirrorScale: IScale;    // когда нет слева или справа ни одной шкалы

    private dirtyDraw: boolean;     // если прорисовка запрещена, то график помечается как "грязный"
    private enableRedraw: boolean;  // разрешает прорисовку на канвасе
    private needCalculate: boolean; // график нуждается в перерасчете

    private rawTime: Date;          // для timeLine
    private valTime: Date;          // для timeLine

    private content: HTMLDivElement;
    private wrapEvent: HTMLDivElement;
    private pointer: HTMLDivElement;
    private timeLine: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    public init(config: IConfig): void {
        this.settings = mergeIf({}, config.settings || {}, ChartTime.settings);

        // legend and tooltip
        this.initLegend(mergeIf({}, config.legend || {}, ChartTime.config.legend));
        this.initTooltip(mergeIf({}, config.tooltip || {}, ChartTime.config.tooltip));

        // init: dirtyDraw, enableRedraw
        this.dirtyDraw = false;
        this.enableRedraw = config.disableRedraw;

        super.init(config);

        // init scales
        const additionalScales: IScale[] = updateScales([{
            type: "xscale",
            key: X_SCALE_NANE,
        }, {
            key: "default",
            minValue: 0,
            maxValue: 1,
        }, {
            // without configuration
        }], []);

        // init x scale
        this.xScalesToDraw = [additionalScales[0]];

        // init additional
        this.defaultScale = additionalScales[1];
        this.mirrorScale = additionalScales[2];

        this.series = [];

        // update source, series, y scales
        this.update(config);
    }

    public bindTo(bindTo: HTMLElement): void {
        const dirtyDraw: boolean = this.dirtyDraw;
        const enableRedraw: boolean = this.enableRedraw;

        this.dirtyDraw = false;
        this.disableRedraw(true);

        super.bindTo(bindTo);

        this.dirtyDraw = dirtyDraw;
        this.disableRedraw(enableRedraw);
    }

    public afterRender(): void {
        this.content = this.container.querySelector(".chart-time-content") as HTMLDivElement;
        this.wrapEvent = this.content.querySelector(".chart-time-content-wrap-event") as HTMLDivElement;
        this.pointer = this.content.querySelector(".chart-time-line-pointer") as HTMLDivElement;
        this.timeLine = this.content.querySelector(".chart-time-line-time") as HTMLDivElement;
        this.canvas = this.content.querySelector("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        this.legend.bindTo(this.container);
        this.tooltip.setTarget(this.wrapEvent);

        // events
        this.initEvent();
    }

    public update(config: IConfig): void {
        if (!config.source) { config.source = {}; }
        if (!config.series) { config.series = []; }
        if (!config.scales) { config.scales = []; }

        // установим смещение в 0, и масштаб 1
        this.offset = 0;
        this.scale = 1;

        this.updateSeries(config.series, this.updateScales(config.scales));
        this.legend.update(this.series);

        this.load(config.source);
    }

    public updateScales(scales: any[]): boolean {
        const ln: number = scales.length;
        let conf: any;

        let scaleDefault: boolean = false;
        const hasScales = {};

        if (ln === 0) {
            // если шкалы не заданы, то создадим свою "по умолчанию"
            scaleDefault = true;
            scales = [{ key: "default" }];
        } else {
            for (let i: number = 0; i < ln; ++i) {
                conf = scales[i];

                if (conf.type && conf.type !== "yscale") {
                    conf.type = "yscale";

                    if (isEnablePrintWarn()) {
                        console.warn(`У серии тип может быть только yscale`);
                        console.warn(conf);
                    }
                }

                if (isEnablePrintWarn()) {
                    if (!conf.key) {
                        console.warn(`У шкалы обязательно должен быть задан ключ <key>`);
                        console.warn(conf);
                        continue;
                    }

                    if (hasScales.hasOwnProperty(conf.key)) {
                        console.warn(`Найдена шкала с повторяющимся ключом ${conf.key}`);
                        console.warn(conf);
                        continue;
                    }

                    hasScales[conf.key] = true;
                }
            }
        }

        this.scales = updateScales(scales, this.scales);
        return scaleDefault;
    }

    public updateSeries(series: any[], scaleDefault: boolean): void {
        const ln: number = series.length;
        let conf: any;

        let gen: number = 0;

        for (let i: number = 0; i < ln; ++i) {
            conf = series[i];

            if (!conf.title && isEnablePrintWarn()) {
                conf.title = `auto title ${(++gen)}`;
                console.warn(`У серии обязательно должен быть задан заголовок <title>`);
                console.warn(conf);
            }

            if (!conf.scale && scaleDefault) {
                conf.scale = "default";
            }
        }

        this.series = updateSeries(series, this.series);
    }

    public load(data: any): void {
        this.eachGroupSeries(this.series, "source", data, this.loadDataToSeries);
        this.legend.load(this.series);

        this.xScalesToDraw[0].updateMinAndMax(this.series.filter((s: ISeries) => {
            return s.data;
        }), "minX", "maxX");

        this.rawTime = null;
        this.valTime = null;

        this.tooltip.remove();

        this.needCalculate = true;
        this.redraw();
    }

    public setSize(width: number, height: number): void {
        if (this.container) {
            const oldWidthContent: number = this.content.style.width ? parseInt(this.content.style.width, 10) : 0;
            const newWidthContent: number = width - (this.legend.isShow ? this.legend.width : 0);

            if (oldWidthContent !== 0) {
                this.offset *= newWidthContent / oldWidthContent;
            }

            this.content.style.width = newWidthContent + "px";
            this.canvas.setAttribute("width", newWidthContent.toString());
            this.canvas.setAttribute("height", height.toString());

            this.needCalculate = true;
            if (this.width !== width) {
                const ln: number = this.series.length;
                for (let i: number = 0; i < ln; ++i) {
                    this.series[i].filterScale = -1;
                }
            }

            const top: string = this.settings.margin + "px";
            const hgt: string = (height - (this.settings.margin * 2)) + "px";
            this.pointer.style.top = top;
            this.timeLine.style.top = top;
            this.pointer.style.height = hgt;
            this.timeLine.style.height = hgt;
        }

        super.setSize(width, height);
        this.redraw();
    }

    public setScale(scale: number): void {
        this._setScale(scale);
        this.redraw();
    }

    public setOffset(offset: number): void {
        this._setOffset(offset);
        this.redraw();
    }

    public setTimeLine(date: Date, isCenter?: boolean): void {
        const sizeBody: number[] = this.getSizeBody();

        this._setTimeLine(date);

        if (isCenter && this.valTime) {
            const xScale: IScale = this.xScalesToDraw[0];
            const percent: number = (this.valTime.getTime() - xScale.min) / (xScale.max - xScale.min);
            const bodyWidth: number = sizeBody[0];
            const offset: number = (bodyWidth / 2) - (bodyWidth * this.scale * percent);

            this.setOffset(offset);
        } else {
            this.updateTimeLine(sizeBody);
        }
    }

    public setSetting(setting: string, value: any): void {
        this.settings[setting] = value;
        this.redraw();
    }

    public disableRedraw(disable: boolean): void {
        this.enableRedraw = disable === false;

        if (this.enableRedraw && this.dirtyDraw) {
            this.redraw();
        }
    }

    public show(show?: boolean) {
        super.show(show);

        if (this.isShow) {
            if (this.dirtyDraw) {
                this.redraw();
            }
        } else {
            this.tooltip.remove();
        }
    }

    public destroy(): void {
        this.tooltip.destroy();
        this.tooltip = null;

        this.legend.destroy();
        this.legend = null;

        this.source = null;

        this.series = updateSeries([], this.series) && null;
        this.scales = updateScales([], this.scales) && null;
        this.xScalesToDraw = updateScales([], this.xScalesToDraw) && null;

        this.defaultScale.destroy();
        this.defaultScale = null;

        this.mirrorScale.destroy();
        this.mirrorScale = null;

        this.yScalesToDraw = null;

        this.settings = null;

        this.ctx = null;
        this.canvas = null;
        this.wrapEvent = null;
        this.content = null;

        super.destroy();
    }

    public getSeriesToDraw(): ISeries[] {
        return this.series.filter((s) => {
            return s.data && s.show;
        });
    }

    public redraw(activeSeries?: ISeries): void {
        if (this.container && this.enableRedraw && this.isShow) {
            // console.time("redraw");
            const sizeBody: number[] = this.getSizeBody();
            const series: ISeries[] = this.getSeriesToDraw().sort((s1, s2) => {
                return s2.priority - s1.priority;
            });

            if (this.needCalculate) {
                this.updateYScales(series, sizeBody);
                this.recalculate(series, sizeBody);
                this.needCalculate = false;
            }

            // coordChartTime - top const
            coordChartTime.update(this.offset, this.scale, this.settings.margin, sizeBody[0], sizeBody[1]);

            this.updateXScales(coordChartTime, sizeBody);
            this.filter(series, coordChartTime, sizeBody);

            this.updateTimeLine(sizeBody);

            this._redraw(series, coordChartTime, activeSeries);
            // console.timeEnd("redraw");
            this.dirtyDraw = false;
        } else {
            this.dirtyDraw = true;
        }
    }

    private _redraw(series: ISeries[], coord: Coord, activeSeries?: ISeries): void {
        const sizeCanvas: number[] = this.getSizeCanvas();

        this.ctx.font = this.settings.sizeText + "px " + this.settings.font;

        this.crearCanvas(this.ctx, sizeCanvas);
        this.drawGrid(this.ctx, coord, sizeCanvas);
        this.drawSeries(this.ctx, series, coord, activeSeries);
        this.drawScales(this.ctx, coord, activeSeries);
    }

    private crearCanvas(ctx: CanvasRenderingContext2D, sizeCanvas: number[]): void {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.globalAlpha = 1;
        ctx.lineWidth = 1;
        ctx.fillRect(0, 0, sizeCanvas[0], sizeCanvas[1]);
        ctx.stroke();
    }

    private drawGrid(ctx: CanvasRenderingContext2D, coord: Coord, sizeCanvas: number[]): void {
        let ln: number;
        let i: number;

        let a: number;
        let b: number;

        let coords: number[];

        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "black";
        ctx.globalAlpha = 0.1;

        a = coord.getTop();
        b = this.xScalesToDraw[0].coord;
        coords = this.xScalesToDraw[0].coords;
        ln = coords.length;
        for (i = 0; i < ln; ++i) {
            ctx.moveTo(coords[i], a);
            ctx.lineTo(coords[i], b);
        }

        a = 0;
        b = sizeCanvas[0];
        coords = this.yScalesToDraw[0].coords;
        ln = coords.length;
        for (i = 0; i < ln; ++i) {
            ctx.moveTo(a, coords[i]);
            ctx.lineTo(b, coords[i]);
        }

        ctx.stroke();
    }

    private drawSeries(ctx: CanvasRenderingContext2D, series: ISeries[], coord: Coord, activeSeries?: ISeries): void {
        const ln: number = series.length;
        let s: ISeries;

        for (let i: number = 0; i < ln; ++i) {
            s = series[i];
            this.activeDraw(ctx, coord, s, activeSeries && activeSeries !== s);
        }
    }

    private drawScales(ctx: CanvasRenderingContext2D, coord: Coord, activeSeries?: ISeries): void {
        let ln: number;
        let i: number;

        for (i = 0, ln = this.xScalesToDraw.length; i < ln; ++i) {
            this.xScalesToDraw[i].draw(ctx, coord);
        }

        let scale: IScale;
        for (i = 0, ln = this.yScalesToDraw.length; i < ln; ++i) {
            scale = this.yScalesToDraw[i];
            this.activeDraw(ctx, coord, scale, activeSeries && activeSeries.scale !== scale.key);
        }
    }

    private activeDraw(
            ctx: CanvasRenderingContext2D,
            coord: Coord,
            instance: { opacity: number, draw: (ctx: CanvasRenderingContext2D, coord: Coord) => void },
            hypersensitivity: boolean): void {

        let opacity: number;

        if (hypersensitivity) {
            opacity = instance.opacity;
            instance.opacity = opacity / this.settings.hypersensitivity;
        }

        instance.draw(ctx, coord);

        if (hypersensitivity) {
            instance.opacity = opacity;
        }
    }

    private findScalesToDrawAndUpdateMinAndMax(series: ISeries[]): IScale[] {
        const result: IScale[] = [];
        let scaleName: string;
        let scale: IScale;

        this.eachGroupSeries(series, "scale", toMap(this.scales, "key"), (s: ISeries[], map: any) => {
            scaleName = s[0].scale;

            if (map.hasOwnProperty(scaleName)) {
                scale = map[scaleName];

                scale.updateMinAndMax(s, "minY", "maxY");
                result.push(scale);
            }
        });

        if (result.length === 0) {
            this.defaultScale.updateMinAndMax([], "minY", "maxY");
            result.push(this.defaultScale);
        }

        return result;
    }

    private updateYScales(series: ISeries[], sizeBody: number[]): void {
        this.yScalesToDraw = this.findScalesToDrawAndUpdateMinAndMax(series);
        YScale.updateTicks(this.yScalesToDraw, sizeBody, this.settings, this.mirrorScale);
    }

    private updateXScales(coord: Coord, sizeBody: number[]): void {
        XScale.updateTicks(this.xScalesToDraw, sizeBody, this.settings, coord);
    }

    private updateTimeLine(sizeBody: number[]): void {
        if (this.settings.useTimeLine && this.valTime) {
            const xScale: IScale = this.xScalesToDraw[0];
            const percent: number = (this.valTime.getTime() - xScale.min) / (xScale.max - xScale.min);
            const bodyWidth: number = sizeBody[0];
            const x: number = bodyWidth * this.scale * percent + this.offset;

            if (x >= 0 && x <= bodyWidth) {
                this.timeLine.style.display = "block";
                this.timeLine.style.left = x + "px";
                return;
            }
        }

        this.timeLine.style.display = "none";
    }

    private recalculate(series: ISeries[], sizeBody: number[]): void {
        this.eachGroupSeries(series, "source", this.interpreter(sizeBody), this.calculate);
    }

    private interpreter(sizeBody: number[]): IInterpritar {
        const result: IInterpritar = {};
        let scale: IScale;

        scale = this.xScalesToDraw[0];
        result[scale.key] = scale.interpreter(sizeBody[0], false);

        const ln: number = this.yScalesToDraw.length;

        for (let i: number = 0; i < ln; ++i) {
            scale = this.yScalesToDraw[i];
            result[scale.key] = scale.interpreter(sizeBody[1], true);
        }

        return result;
    }

    private calculate(series: ISeries[], interpritar: IInterpritar): void {
        const hasPoint: { [propName: string]: boolean } = {};
        const accumulate: IAccumulate[] = [];

        let lnI: number;
        let i: number;

        let point: IPoint;
        let s: ISeries;

        for (i = 0, lnI = series.length; i < lnI; ++i) {
            s = series[i];

            for (const key in s.point) {
                if (!s.point.hasOwnProperty(key)) {
                    continue;
                }

                point = s.point[key];
                point.key = (point.isDate ? X_SCALE_NANE : s.scale) + "_" + point.path;

                if (!hasPoint.hasOwnProperty(point.key)) {
                    hasPoint[point.key] = true;
                    accumulate.push({
                        calc: point.isDate ? interpritar[X_SCALE_NANE] : interpritar[s.scale],
                        point,
                    });
                }
            }
        }

        // -----------------

        const data: IItemRaw[] = series[0].data;
        const calc: IItem[] = series[0].calc;

        let itemData: IItemRaw;
        let itemCalc: IItem;

        let acc: IAccumulate;
        let lnJ: number;
        let j: number;

        lnI = data.length;
        lnJ = accumulate.length;

        for (i = 0; i < lnI; ++i) {
            itemData = data[i];
            itemCalc = calc[i];

            for (j = 0; j < lnJ; ++j) {
                acc = accumulate[j];

                itemCalc[acc.point.key] = acc.calc(acc.point.accessor(itemData));
            }
        }
    }

    private filter(series: ISeries[], coord: Coord, sizeBody: number[]): void {
        const ln = series.length;
        let s: ISeries;

        for (let i: number = 0; i < ln; ++i) {
            s = series[i];

            if (Math.abs(s.filterScale - this.scale) > 0.0001) {
                s.filterColander(this.settings.filterQuality, this.scale);
                s.filterScale = this.scale;
            }

            s.filterBetween(coord, sizeBody);
        }
    }

    private _setScale(scale: number): void {
        const xScale: IScale = this.xScalesToDraw[0];

        if (xScale.max === null) {
            this.scale = 1;
            return;
        }

        const bodyWidth: number = this.getSizeBody()[0];
        const fullX = xScale.max - xScale.min;
        const maxCountTime: number = 2500; // TODO !!

        // scale * bodyWidth = fullX
        //             100px = msec
        //
        // сколько миллесекунд помещается в 100 пикселей
        //
        //  scale = scale
        //            100px * fullX
        //  msec = -------------------
        //          bodyWidth * scale
        //
        //
        //  msec = maxCountTime
        //            100px * fullX
        // scale = -------------------
        //          bodyWidth * msec
        //

        if ((100 * fullX) / (bodyWidth * scale) < maxCountTime) {
            scale = (100 * fullX) / (bodyWidth * maxCountTime);
        }

        if (scale < 1) {
            scale = 1;
        }

        this.scale = scale;
    }

    private _setOffset(offset: number): void {
        const bodyWidth: number = this.getSizeBody()[0];

        if (offset > bodyWidth) {
            offset = bodyWidth;
        }

        if (-offset > this.scale * bodyWidth) {
            offset = -(this.scale * bodyWidth);
        }

        this.offset = offset;
    }

    private _setTimeLine(date: Date): void {
        const xScale: IScale = this.xScalesToDraw[0];

        if (date === null || xScale.min === null || xScale.max === null) {
            this.valTime = null;
            return;
        }

        const time: number = date.getTime();

        if (time < xScale.min) {
            date = new Date(xScale.min);
        }

        if (xScale.max < time) {
            date = new Date(xScale.max);
        }

        this.valTime = date;
    }

    private initEvent(): void {
        let isDraged: boolean;

        this.dragDrop = new Drag(
            (event: MouseEvent, width: number, height: number) => {
                isDraged = true;
                this.onMove(event, width);
            },
            (event: MouseEvent, width: number, height: number) => {
                if (!isDraged) {
                    // time-line
                    this.setTimeLine(this.rawTime);

                    this.fire("onChangeTimeLine");
                }
            },
        );

        this.cacheEvent.on(this.wrapEvent, {
            mousedown: (event: MouseEvent) => {
                isDraged = false;
                this.dragDrop.start(event, this.offset, 0);
            },
            dblclick: () => {
                this.fire("onDblClick");
            },
            wheel: (event: MouseEvent) => {
                this.onWheel(event);
            },
        });
    }

    private onMove(event: MouseEvent, offset: number): void {
        this.setOffset(offset);
        this.fire("onChangeOffset");
    }

    private onWheel(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        const bodyWidth: number = this.getSizeBody()[0];
        const scaleWidth = bodyWidth * this.scale;

        const scroll: number = (event as any).deltaY || event.detail || (event as any).wheelDelta;
        this._setScale((scroll > 0) ? (this.scale / 1.4) : (this.scale * 1.4));

        // x
        const x: number = event.clientX - (event.target as HTMLDivElement).getBoundingClientRect().left;
        // на каком участке графика произошло событие масштабирования. с учетом смещения, отступов
        const left: number = x - this.offset;
        // на каком участке графика произошло событие масштабирования в процентном соотношении
        const percent: number = left / scaleWidth;

        // ofs - на сколько пикселей нужно сместить график влево
        // т.е. мы берем новую ширину width * scale и вычитам старую ширину scaleWidth
        // получим, на сколько пикселей увеличился\уменьшился наш график

        // например, наш график был 100 пикселй.
        // увеличили его в 1.4 раза и он стал 140 пикселей
        // значит он увеличился на 40 пикселей (140 - 100)

        // далее умножаем на некий "процент смещения". т.е. когда график увеличивается
        // он "пухнет" (толстеет) и в какую сторону ему толстеть? влево или вправо?
        // этот коэффициент (процент) указывает куда графику расширяться. если например
        // percent равен 0.29, то влево он увеличится на 29%, а вправо 100% - 29% = 71% на 71 процент

        // т.е. график расширился на 40 пикселей. а именно
        // слева он вырос на 40 * 0.29 = 11.6 пикселей
        // а справа он вырос на 40 * 0.71 = 28.4 пикселей

        const ofs: number = (bodyWidth * this.scale - scaleWidth) * percent;
        this._setOffset(this.offset - ofs);

        this.redraw();

        this.fire("onChangeScale");
    }

    private initLegend(config: IConfig): void {
        const me: ChartTime = this;
        const delayRedraw = delay(200, () => {
            if (this.container) { // destroyed
                this.redraw();
            }
        });

        config.events = {
            onChangeWidth(legend: Legend): void {
                const enableRedraw: boolean = me.enableRedraw;

                me.enableRedraw = false;
                me.setSize(me.width, me.height);
                me.enableRedraw = true;

                me.pointer.style.display = "none";
                me.timeLine.style.display = "none";

                me.fire("onChangeWidthLegend");

                delayRedraw();
            },
            onSelectSeries(legend: Legend): void {
                me.redraw(legend.selected);
            },
            onHideSeries(legend: Legend): void {
                me.needCalculate = true;
                me.redraw();
            },
        };

        this.legend = new Legend(config);

        if (config.buttons) {
            config.buttons.forEach((button: any) => {
                button = typeof button === "string" ? { type : button } : button;
                const ctor: IButtonCtor = ChartTime.buttons[button.type];
                const btn: Button = new ctor(mergeIf({
                    chartTime: this,
                    tooltip: config.tooltip,
                }, button));

                this.legend.addBtn(btn);
            });
        }
    }

    private initTooltip(config: IConfig): void {
        const me: ChartTime = this;

        config.events = {
            onCreate(tooltip: Tooltip, event: MouseEvent) {
                const markup: string = me.getSeriesToDraw().map((series: ISeries) => {
                    return "<tr data-series-id=\"" + series.id + "\">" +
                        "<td>" +
                            "<div" +
                                " class=\"chart-time-tooltip-data-color\"" +
                                " style=\"background-color: " + series.color + ";\"></div>" +
                            series.title +
                        "</td>" +
                        "<td class=\"value\">&nbsp;</td>" +
                    "</tr>";
                }).join("");

                tooltip.update([
                   "<table class=\"chart-time-tooltip-data\">",
                       "<tbody>",
                           "<tr>",
                                "<th colspan=\"2\">",
                                    "<span>Время: </span>",
                                    "<span class=\"time\"></span>",
                                "</th>",
                            "</tr>",
                            markup,
                        "</tbody>",
                    "</table>",
                ]);
            },
            onMove(tooltip: Tooltip, event: MouseEvent) {
                const clientRect: ClientRect = me.wrapEvent.getBoundingClientRect();
                const x: number = event.clientX - clientRect.left;
                const y: number = event.clientY - clientRect.top;

                const sizeBody: number[] = me.getSizeBody();
                const bodyWidth: number = sizeBody[0];
                const bodyHeight: number = sizeBody[1];
                const scaleWidth: number = bodyWidth * me.scale;

                const xScale: IScale = me.xScalesToDraw[0];

                const isInside: boolean = y >= me.settings.margin && y <= bodyHeight + me.settings.margin;
                const isNotTime: boolean = xScale.min === null || xScale.max === null;
                const isUpdate: boolean = isInside && !isNotTime;

                const tTip: HTMLDivElement = tooltip.container as HTMLDivElement;

                if (me.settings.usePointerLine) {
                    if (isInside) {
                        me.pointer.style.display = "block";
                        me.pointer.style.left = x + "px";
                    } else {
                        me.pointer.style.display = "none";
                    }
                }

                if (isUpdate) {
                    const trList: HTMLCollection = tTip.children[0].children[0].children;
                    const fullX: number = xScale.max - xScale.min;
                    const left: number = x - me.offset;
                    //                       left * fullX
                    //  date = xScale.min + --------------
                    //                        scaleWidth
                    const date: Date = new Date(xScale.min + left * fullX / scaleWidth);
                    trList[0].children[0].children[1].innerHTML = formatTime(date) + " " + formatDate(date);

                    // TODO !!
                    coordChartTime.update(me.offset, me.scale, me.settings.margin, sizeBody[0], sizeBody[1]);

                    let tr: HTMLTableRowElement;
                    me.getSeriesToDraw().forEach((s: ISeries, index: number) => {
                        tr = trList[index + 1] as HTMLTableRowElement;
                        s.tooltip(tr, tr.children[1] as HTMLTableCellElement, x, coordChartTime);
                    });

                    // time-line
                    me.rawTime = date;
                } else {

                    // time-line
                    me.rawTime = null;
                }

                me.fire("onChangeTooltip");

                return isUpdate;
            },
            onRemove(tooltip: Tooltip, event: MouseEvent) {
                me.pointer.style.display = "none";
                me.fire("onChangeTooltip");

                // time-line
                me.rawTime = null;
            },
        };

        this.tooltip = new Tooltip(config);
    }

    private eachGroupSeries(series: ISeries[], type, arg: any, callback: (series: ISeries[], arg: any) => void): void {
        const group = toGroup(series, type);

        for (const key in group) {
            if (group.hasOwnProperty(key)) {
                callback(group[key], arg);
            }
        }
    }

    private loadDataToSeries(series: ISeries[], source: any): void {
        let i: number;
        let ln: number;

        let data: IItemRaw[] = null;
        let calc: IItem[] = null;

        for (i = 0, ln = series.length; i < ln; ++i) {
            if (source.hasOwnProperty(series[i].source)) {
                data = source[series[i].source];
                break;
            }
        }

        if (data !== null) {
            calc = new Array(data.length);

            for (i = 0, ln = data.length; i < ln; ++i) {
                calc[i] = { $index: i };
            }
        }

        for (i = 0, ln = series.length; i < ln; ++i) {
            series[i].load(data, calc);
        }
    }

    private getSizeCanvas(): number[] {
        return [
            parseInt(this.canvas.getAttribute("width"), 10),
            parseInt(this.canvas.getAttribute("height"), 10),
        ];
    }

    private getSizeBody(): number[] {
        const size: number[] = this.getSizeCanvas();
        size[1] = size[1] - this.settings.margin * 2; // высота икса
        return size;
    }
}
