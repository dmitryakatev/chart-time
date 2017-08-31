import { isEnablePrintWarn } from "./modules/PrintWarn";

import { ChartTime } from "./ChartTime";
import { Widget, IConfig } from "./modules/Widget";

import { Button } from "./modules/buttons/Button";
import { Damage } from "./modules/buttons/Damage";

import { Updater } from "./modules/Updater";

import { IScale } from "./scales/index";
import { ISeries } from "./series/index";

import { mergeIf, isNumeric, MIN_VALUE, MAX_VALUE } from "./utils/util";

export class ChartGroup extends Widget {

    public static config: IConfig = {
        width: 400,
        height: 300,
        disableRedraw: false,
        grouping: true,
        marginChart: 5,
        legend: {
            minWidth: 105,
            buttons: ["damage", "full", "group"],
        },
        tooltip: {},
        settings: {},
        // events: {
        //     onChangeScale?: (instance: ChartGroup) => any;
        //     onChangeOffset?: (instance: ChartGroup) => any;
        //     onChangeWidthLegend?: (instance: ChartGroup) => any;
        //     onChangeTooltip?: (instance: ChartGroup) => any;
        //     onChangeTimeLine?: (instance: ChartGroup) => any;
        //     onChangeSetting?: (instance: ChartGroup) => any;
        //     onDblClick?: (instance: ChartGroup) => any;
        // },
    };

    public static template: string = [
        "<div class=\"chart-time-group\"></div>",
    ].join("");

    public source: any;
    public charts: ChartTime[];
    public scales: IScale[];
    public series: { [propName: string]: ISeries[] };

    public config: IConfig;

    private grouping: boolean;
    private indexBtn: number;

    private marginChart: number;
    private defaultScale: boolean;
    private enableRedraw: boolean;

    private updater: Updater<ChartTime>;

    public init(config: IConfig): void {
        this.charts = [];
        this.series = {};

        this.grouping = config.grouping !== false;
        this.marginChart = config.marginChart;
        this.indexBtn = null;

        this.config = {
            bindTo: null,

            source: {},
            series: null,
            scales: null,

            width: 300,
            height: 50,
            show: true,
            events: {
                onChangeScale: this.bindEvent("onChangeState"),
                onChangeOffset: this.bindEvent("onChangeState"),
                onChangeWidthLegend: this.bindEvent("onChangeWidthLegend"),
                onChangeTooltip: this.bindEvent("onChangeTooltip"),
                onChangeTimeLine: this.bindEvent("onChangeTimeLine"),
                onChangeSetting: this.bindEvent("onChangeSetting"),
                onDblClick: this.bindEvent("onDblClick"),
            },
            legend: mergeIf({}, config.legend, ChartGroup.config.legend),
            tooltip: mergeIf({}, config.tooltip, ChartGroup.config.tooltip),
            settings: mergeIf({}, config.settings, ChartGroup.config.settings),
            disableRedraw: true,
        };

        if (this.config.legend && this.config.legend.buttons) {
            this.config.legend.buttons = this.config.legend.buttons.map((type: string, index: number) => {
                const info: any = { type };
                if (type === "group") {
                    info.chartGroup = this;
                    this.indexBtn = index;
                }
                return info;
            });
        }

        this.updater = new Updater<ChartTime>(null,
            this._createChart.bind(this),
            this._updateChart.bind(this),
            this._removeChart.bind(this),
        );

        super.init(config);

        this.disableRedraw(config.disableRedraw);
        this.update(config);
    }

    public bindTo(bindTo: HTMLElement): void {
        super.bindTo(bindTo);
        this.applyUpdate();
    }

    public afterRender(): void {
        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.bindTo(this.container);
        });
    }

    public update(config: IConfig): void {
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
            chartTime.legend.update([]);
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

    public setSize(width: number, height: number): void {
        super.setSize(width, height);

        const size: number[] = this.findChartSize();

        this.charts.forEach((chartTime: ChartTime) => {
            if (chartTime.isShow) {
                chartTime.setSize(size[0], size[1]);
            }
        });
    }

    public setTimeLine(date: Date, isCenter: boolean): void {
        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.setTimeLine(date, isCenter);
        });
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
            if (this.indexBtn !== null) {
                const btn: Button = chartTime.legend.getBtn(this.indexBtn);
                if (btn.container) {
                    if (this.grouping) {
                        this.addClass(btn.container.children[0] as HTMLDivElement, classExpanded);
                    } else {
                        this.removeClass(btn.container.children[0] as HTMLDivElement, classExpanded);
                    }
                } else {
                    if (this.grouping) {
                        btn.className = this.grouping ? classExpanded : null;
                    }
                }
            }
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
        this.charts.forEach((chartTime: ChartTime) => {
            chartTime.legend.showBtn(show, index);
        });
    }

    public findChartShow(): ChartTime {
        const ln: number = this.charts.length;
        let chartTime: ChartTime;

        for (let i: number = 0; i < ln; ++i) {
            chartTime = this.charts[i];

            if (chartTime.isShow) {
                return chartTime;
            }
        }

        return null;
    }

    private bindEvent(methodName: string) {
        return (instance: ChartTime) => {
            this.charts.forEach((chartTime: ChartTime) => {
                if (instance !== chartTime) {
                    this[methodName](chartTime, instance);
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

    private onChangeTooltip(chartTime: ChartTime, instance: ChartTime): void {
        const selector: string = "chart-time-line-pointer";

        const line1: HTMLDivElement = instance.container.querySelector("." + selector) as HTMLDivElement;
        const line2: HTMLDivElement = chartTime.container.querySelector("." + selector) as HTMLDivElement;

        line2.style.left = line1.style.left;
        line2.style.display = line1.style.display;
    }

    private onChangeTimeLine(chartTime: ChartTime, instance: ChartTime): void {
        chartTime.setTimeLine((instance as any).valTime);
    }

    private onChangeSetting(chartTime: ChartTime, instance: ChartTime): void {
        if (instance.settings.filterQuality === chartTime.settings.filterQuality) {
            return;
        }

        const damage: number = instance.settings.filterQuality;
        chartTime.settings.filterQuality = damage;
        chartTime.legend.buttons.forEach((btn: Button) => {
            if (btn instanceof Damage) {
                (btn as Damage).select(damage);
            }
        });

        chartTime.series.forEach((s: ISeries) => {
            s.filterScale = -1;
        });

        chartTime.redraw();
    }

    private onDblClick(chartTime: ChartTime, instance: ChartTime): void {
        // empty
    }

    // ------
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
    private _createChart(config: IConfig): ChartTime {
        this.config.series = null;
        this.config.scales = null;

        this.config.bindTo = this.container || null;
        const chartTime: ChartTime = new ChartTime(this.config);
        this.config.bindTo = null;

        if (chartTime.container) {
            chartTime.container.style.margin = this.marginChart + "px";
        }

        this._updateChart(chartTime, config);
        return chartTime;
    }

    private _updateChart(chartTime: ChartTime, config: IConfig): void {
        chartTime.disableRedraw(true);

        if (!config.series) { config.series = []; }

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
