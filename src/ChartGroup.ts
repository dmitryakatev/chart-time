import { isEnablePrintWarn } from "./modules/PrintWarn";

import { ChartTime, IChartTimeConfig, IChartTimeEvents, ISettings } from "./ChartTime";

import { Updater } from "./modules/Updater";
import { CacheEvent } from "./modules/CacheEvent";

import { ILegendConfig } from "./modules/Legend";
import { ITooltipConfig } from "./modules/Tooltip";

import { IScale } from "./scales/index";
import { ISeries } from "./series/index";

import { createDOM, mergeIf, isNumeric, MIN_VALUE, MAX_VALUE } from "./utils/util";

export interface IChartTimeSimpleConfig {
    name?: string;
    series?: any[];
}

export interface IChartGroupSource {
    source?: any;
    charts?: IChartTimeSimpleConfig[];
    scales?: any[];
}

export interface IChartGroupConfig extends IChartGroupSource {
    width?: number;
    height?: number;
    events?: IChartTimeEvents;
    legend?: ILegendConfig;
    tooltip?: ITooltipConfig;
    settings?: ISettings;
    disableRedraw?: boolean;

    grouping?: boolean;
    showBtnGroup?: boolean;
    marginChart?: number;
}

const defaultConfig = {
    width: 400,
    height: 300,
    disableRedraw: false,
    grouping: true,
    showBtnGroup: true,
    marginChart: 5,
};

const template: string = [
    "<div class=\"chart-time-group\"></div>",
].join("");

export class ChartGroup {
    public width: number;
    public height: number;

    public source: any;
    public charts: ChartTime[];
    public scales: IScale[];
    public series: { [propName: string]: ISeries[] };

    public config: IChartTimeConfig;

    public events: IChartTimeEvents;

    private grouping: boolean;
    private showBtnGroup: boolean;
    private marginChart: number;
    private defaultScale: boolean;
    private enableRedraw: boolean;

    private updater: Updater<ChartTime>;

    private container: HTMLDivElement;

    constructor(bindTo: Element, config: IChartGroupConfig) {
        mergeIf(config, defaultConfig);
        this.events = config.events || {};

        this.container = createDOM(template) as HTMLDivElement;
        bindTo.appendChild(this.container);

        this.charts = [];
        this.series = {};
        this.setSize(config.width, config.height);
        this.disableRedraw(config.disableRedraw);

        this.grouping = config.grouping !== false;
        this.showBtnGroup = config.showBtnGroup;
        this.marginChart = config.marginChart;

        this.config = {
            source: {},
            series: null,
            scales: null,

            width: 300,
            height: 100,
            show: true, // false,
            events: {
                onChangeScale: this.bindEvent("onChangeState"),
                onChangeOffset: this.bindEvent("onChangeState"),
                onChangeWidthLegend: this.bindEvent("onChangeWidthLegend"),
                onChangeTooltip: this.bindEvent("onChangeLine", "chart-time-line-pointer"),
                onChangeTimeLine: this.bindEvent("onChangeLine", "chart-time-line-time"),
                onChangeSetting: this.bindEvent("onChangeSetting"),
                onDblClick: this.bindEvent("onDblClick"),
            },
            legend: mergeIf(config.legend || {}, { minWidth: 105 }),
            tooltip: config.tooltip,
            settings: config.settings,
            disableRedraw: true,
        };

        this.updater = new Updater<ChartTime>(null,
            this._createChart.bind(this),
            this._updateChart.bind(this),
            this._removeChart.bind(this),
        );

        this.update(config);
    }

    public update(config: IChartGroupSource): void {
        if (!config.source) { config.source = {}; }
        if (!config.charts) { config.charts = []; }
        if (!config.scales) { config.scales = []; }

        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.series = this.series[chartTime.id];
        });
        this.series = {};

        this.defaultScale = ChartTime.prototype.updateScales.call(this, config.scales);
        this.charts = this.updater.update(config.charts, this.charts);

        this.load(config.source);
    }

    public load(data: any): void {
        this.cleanSource();

        let minTime: number = MAX_VALUE;
        let maxTime: number = MIN_VALUE;
        let valTime: number;
        let scale: IScale;

        this.charts.forEach((chartTime: ChartTime) => {
            this.extendSource(chartTime.id, data);

            chartTime.scale = 1;
            chartTime.offset = 0;

            chartTime.series = this.series[chartTime.id];
            chartTime.legend.load([]);
            chartTime.load(this.config.source);
            scale = chartTime.xScalesToDraw[0];

            valTime = scale.min;
            if (valTime !== null && valTime < minTime) {
                minTime = valTime;
            }

            valTime = scale.max;
            if (valTime !== null && valTime > maxTime) {
                maxTime = valTime;
            }
        });

        minTime = minTime === MAX_VALUE ? null : minTime;
        maxTime = maxTime === MIN_VALUE ? null : maxTime;

        this.charts.forEach((chartTime: ChartTime) => {
            scale = chartTime.xScalesToDraw[0];

            scale.min = minTime;
            scale.max = maxTime;
        });

        this.enableGrouping(this.grouping);
    }

    public disableRedraw(disable: boolean): void {
        this.enableRedraw = disable === false;

        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.disableRedraw(disable);
        });
    }

    public enableGrouping(grouping: boolean): void {
        this.grouping = grouping !== false;

        const classExpanded: string = "chart-time-icon-group-expanded";
        this.charts.forEach((chartTime: ChartTime) => {
            const btn: HTMLDivElement = chartTime.legend.getBtn(2).children[0] as HTMLDivElement;
            this.grouping ? btn.classList.add(classExpanded) : btn.classList.remove(classExpanded);
        });

        const instance: ChartTime = this.charts[0] || null;
        if (instance) {
            let series: ISeries[];

            if (this.grouping) {
                this.charts.forEach((chartTime: ChartTime) => {
                    series = this.series[chartTime.id];
                    chartTime.series = series;
                    chartTime.legend.update(series);
                    chartTime.legend.load(series);
                });
            } else {
                series = [];
                this.charts.forEach((chartTime: ChartTime) => {
                    series = series.concat(this.series[chartTime.id]);
                    chartTime.series = [];
                });

                instance.series = series;
                instance.legend.update(series);
                instance.legend.load(series);
            }
        }

        this.applyUpdate(instance && instance.scale, instance && instance.offset);
    }

    public applyUpdate(scale: number = 1, offset: number = 0): void {
        let countShow: number = 0;

        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.disableRedraw(true);

            if (chartTime.getSeriesToDraw().length > 0) {
                chartTime.show(true);
                ++countShow;
            } else {
                chartTime.show(false);
            }
        });

        if (countShow === 0 && this.charts.length > 0) {
            this.charts[0].show(true);
        }

        const size: number[] = this.findChartSize();

        this.charts.forEach((chartTime: ChartTime) => {
            if (chartTime.isShow) {
                chartTime.scale = scale;
                chartTime.offset = offset;
                chartTime.setSize(size[0], size[1]);
                chartTime.disableRedraw(!this.enableRedraw);
            }
        });
    }

    public destroy(): void {
        if (this.container === null) {
            if (isEnablePrintWarn()) {
                console.log("chartGroup destroyed!");
            }

            return;
        }

        this.defaultScale = ChartTime.prototype.updateScales.call(this, []);
        this.charts = this.updater.update([], this.charts);
        this.container.parentNode.removeChild(this.container);

        this.container = null;
        this.config = null;
        this.updater = null;

        this.source = null;
        this.series = null;
        this.events = null;
    }

    public showBtn(show: boolean, index?: number): void {
        if (!isNumeric(index) || index === 2) {
            this.showBtnGroup = show;
        }

        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.legend.showBtn(show, index);
        });
    }

    private bindEvent(methodName: string, ...args: any[]) {
        return (instance: ChartTime) => {
            this.charts.forEach((chartTime: ChartTime) => {
                if (instance !== chartTime) {
                    this[methodName](chartTime, instance, args[0]);
                }
            });

            if (this.events.hasOwnProperty(methodName)) {
                this.events[methodName](this);
            }
        };
    }

    // events
    private onChangeState(chartTime: ChartTime, instance: ChartTime): void {
        chartTime.scale = instance.scale;
        chartTime.offset = instance.offset;
        chartTime.redraw();
    }

    private onChangeWidthLegend(chartTime: ChartTime, instance: ChartTime): void {
        chartTime.legend.setWidth(instance.legend.width);
    }

    private onChangeLine(chartTime: ChartTime, instance: ChartTime, selector: string): void {
        const line1: HTMLDivElement = instance.getDom().querySelector("." + selector) as HTMLDivElement;
        const line2: HTMLDivElement = chartTime.getDom().querySelector("." + selector) as HTMLDivElement;
        line2.style.left = line1.style.left;
        line2.style.display = line1.style.display;
    }

    private onChangeSetting(chartTime: ChartTime, instance: ChartTime): void {
        if (instance.settings.filterQuality !== chartTime.settings.filterQuality) {
            chartTime.settings.filterQuality = instance.settings.filterQuality;

            const classItem: string = "chart-time-icon-spanner-context-item";
            const classSeleced: string = classItem + "-selected";
            chartTime.getDom().querySelector("." + classSeleced).classList.remove(classSeleced);
            chartTime.getDom().querySelector(`div[data-quality="${chartTime.settings.filterQuality}"]`)
                     .classList.add(classSeleced);

            chartTime.series.forEach((s: ISeries) => {
                s.filterScale = -1;
            });

            chartTime.redraw();
        }
    }

    private onDblClick(chartTime: ChartTime, instance: ChartTime): void {
        // empty
    }

    // ------
    private setSize(width: number, height: number): void {
        this.container.style.width = width + "px";
        this.container.style.height = height + "px";

        this.width = width;
        this.height = height;

        const size: number[] = this.findChartSize();

        this.charts.forEach((chartTime: ChartTime) => {
            if (chartTime.isShow) {
                chartTime.setSize(size[0], size[1]);
            }
        });
    }

    private findChartSize(): number[] {
        let countShow: number = 0;

        this.charts.forEach((chartTime: ChartTime) => {
            if (chartTime.isShow) {
                ++countShow;
            }
        });

        if (countShow === 0) {
            countShow = 1;
        }

        return [
            this.width - 2 * this.marginChart,
            this.height / countShow - 2 * this.marginChart,
        ];
    }

    // ------
    private _createChart(config: IChartTimeSimpleConfig): ChartTime {
        this.config.series = null;
        this.config.scales = null;

        const chartTime: ChartTime = new ChartTime(this.container, this.config);

        chartTime.getDom().style.margin = this.marginChart + "px";
        this.initBtnGroup(chartTime);
        this._updateChart(chartTime, config);
        return chartTime;
    }

    private _updateChart(chartTime: ChartTime, config: IChartTimeSimpleConfig): void {
        chartTime.disableRedraw(true);

        config.series.forEach((s: any) => {
            if (!s.modifySource) {
                s.modifySource = true;
                s.source = this.joinSourceName(config.name, s.source);
            }
        });

        chartTime.id = config.name;

        chartTime.scales = this.scales;
        chartTime.updateSeries(config.series, this.defaultScale);
        this.series[config.name] = chartTime.series;
    }

    private _removeChart(chartTime: ChartTime): void {
        chartTime.destroy();
    }

    private initBtnGroup(chartTime: ChartTime): void {
        chartTime.legend.addBtn([
            "<div class=\"chart-time-icon chart-time-icon-group\"></div>",
        ], this.showBtnGroup, "Вкл/Выкл группировку", (div: HTMLDivElement, cacheEvent: CacheEvent) => {

            const classExpanded: string = "chart-time-icon-group-expanded";
            const context: HTMLDivElement = div.children[0] as HTMLDivElement;
            this.grouping ? context.classList.add(classExpanded) : context.classList.remove(classExpanded);

            cacheEvent.on(div, {
                click: (event: MouseEvent) => {
                    this.enableGrouping(!this.grouping);
                },
            });
        });
    }

    // ------
    private joinSourceName(chartName, sourceName): string {
        return chartName + "_%_" + sourceName;
    }

    private extendSource(chartName: string, source: any): void {
        for (const sourceName in source) {
            if (source.hasOwnProperty(sourceName)) {
                this.config.source[this.joinSourceName(chartName, sourceName)] = source[sourceName];
            }
        }
    }

    private cleanSource(): void {
        for (const sourceName in this.config.source) {
            if (this.config.source.hasOwnProperty(sourceName)) {
                delete this.config.source[sourceName];
            }
        }
    }
}
