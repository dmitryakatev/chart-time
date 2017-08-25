import { isEnablePrintWarn } from "./PrintWarn";

import { CacheEvent } from "../modules/CacheEvent";
import { Drag } from "./Drag";
import { ISeries } from "../series/index";

import { ITooltipConfig, Tooltip } from "./Tooltip";

import { createDOM, isNumeric, mergeIf } from "../utils/util";

import "../less/legend.less";

export interface ILegendEvents {
    onChangeWidth?: (legend: Legend) => any;
    onSelectSeries?: (legend: Legend) => any;
    onHideSeries?: (legend: Legend) => any; // show or hide
}

export interface ILegendConfig {
    width?: number; // 0 if need hide
    show?: boolean;
    minWidth?: number;
    maxWidth?: number;
    draggable?: boolean;
    tooltip?: ITooltipConfig | boolean;
    events?: ILegendEvents;
}

const template: string = [
    "<div class=\"chart-time-legend\">",
        "<div class=\"chart-time-legend-wrap\">", // chart-time-legend-wrap-top
            "<div class=\"chart-time-legend-content\"></div>",
        "</div>",
        "<div class=\"chart-time-legend-drag\"></div>",
        "<div class=\"chart-time-legend-tool\"></div>", // chart-time-legend-tool-hide
    "</div>",
].join("");

const defaultConfig = {
    width: 250,
    show: true,
    minWidth: 80,
    maxWidth: 300,
    draggable: true,
    tooltip: {
        showDelay: 1000,
        hideDelay: 3000,
        saveDelay: 1000,
    },
};

export class Legend {

    public width: number;
    public minWidth: number;
    public maxWidth: number;
    public draggable: boolean;

    public isShow: boolean;

    public dragDrop: Drag;
    public series: ISeries[];

    public selected: ISeries;

    public events: ILegendEvents;

    public tooltip: Tooltip;

    private cacheEvent: CacheEvent;

    private container: HTMLDivElement;
    private content: HTMLDivElement;
    private tool: HTMLDivElement;
    private drag: HTMLDivElement;

    constructor(bindTo: Element, config: ILegendConfig) {
        mergeIf(config, defaultConfig);
        this.events = config.events || {};

        this.container = createDOM(template) as HTMLDivElement;
        bindTo.appendChild(this.container);

        this.content = this.container.querySelector(".chart-time-legend-content") as HTMLDivElement;
        this.tool = this.container.querySelector(".chart-time-legend-tool") as HTMLDivElement;
        this.drag = this.container.querySelector(".chart-time-legend-drag") as HTMLDivElement;

        this.initEvent();

        this.initTooltip(typeof config.tooltip === "boolean" ? { show: config.tooltip } : (config.tooltip || {}));

        this.dragDrop = new Drag(this.onMove.bind(this));

        this.minWidth = config.minWidth;
        this.maxWidth = config.maxWidth;
        this.setDraggable(config.draggable);
        this._setWidth(config.width);
        this._show(config.show);

        this.selected = null;
    }

    public update(series: ISeries[]): void {
        const ln: number = series.length;
        let markup = "";

        for (let i: number = 0; i < ln; ++i) {
            markup += this.getMarkupItem(series[i]);
        }

        this.content.innerHTML = markup;
    }

    public load(series: ISeries[]): void {
        const children: HTMLCollection = this.content.children;
        const ln: number = children.length;
        let item: HTMLDivElement;

        for (let i: number = 0; i < ln; ++i) {
            item = children[i] as HTMLDivElement;
            item.style.display = series[i].data ? "" : "none";
        }

        this.series = series;
    }

    public setWidth(width: number): void {
        if (this._setWidth(width) && this.events.onChangeWidth) {
            this.events.onChangeWidth(this);
        }
    }

    public show(show: boolean) {
        if (this._show(show !== false) && this.events.onChangeWidth) {
            this.events.onChangeWidth(this);
        }
    }

    public addBtn(
            html: string[],
            show: boolean,
            tooltip: string,
            callback: (div: HTMLDivElement, cacheEvent: CacheEvent) => void,
        ): void {

        const div: HTMLDivElement = document.createElement("div");
        div.setAttribute("class", "chart-time-icon-wrap");
        div.setAttribute("data-tooltip", tooltip);
        div.appendChild(createDOM(html.join("")));
        this.tool.appendChild(div);
        callback(div, this.cacheEvent);
        this.showBtn(show, this.tool.children.length - 1);
    }

    public getBtn(index: number): HTMLDivElement {
        return this.tool.children[index] as HTMLDivElement;
    }

    public showBtn(show: boolean, index?: number): void {
        show = show !== false;

        let btn: HTMLDivElement;

        if (isNumeric(index)) {
            btn = this.tool.children[index] as HTMLDivElement;
            if (show === (btn.style.display === "none")) {
                btn.style.display = show ? "" : "none";
            }
            this.showTool(show || this.isShowAnyBtn());

            return;
        }

        const ln: number = this.tool.children.length;
        for (index = 0; index < ln; ++index) {
            btn = this.tool.children[index] as HTMLDivElement;
            btn.style.display = show ? "" : "none";
        }

        this.showTool(show);
    }

    public setDraggable(dragable: boolean): void {
        this.draggable = dragable !== false;
        const classItem: string = "chart-time-legend-drag";
        this.drag.setAttribute("class", classItem + (this.draggable ? " " + classItem + "-draggable" : ""));
    }

    public destroy(): void {
        if (this.container === null) {
            if (isEnablePrintWarn()) {
                console.log("legend destroyed!");
            }

            return;
        }

        this.dragDrop.destroy();
        this.dragDrop = null;

        this.tooltip.destroy();
        this.tooltip = null;

        this.cacheEvent.off();
        this.cacheEvent = null;

        this.container.parentNode.removeChild(this.container);

        this.series = null;

        this.container = null;
        this.content = null;
        this.tool = null;
        this.drag = null;
    }

    private initEvent(): void {
        this.cacheEvent = new CacheEvent();

        this.cacheEvent.on(this.drag, {
            mousedown: this.onStartDrag.bind(this),
        });

        this.cacheEvent.on(this.content, {
            click: this.onHideSeries.bind(this),
            mouseover: this.onSelectSeries.bind(this),
            mouseout: this.onDeselectSeries.bind(this),
        });
    }

    private initTooltip(config: ITooltipConfig): void {
        const me: Legend = this;

        config.events = {
            onCreate(tooltip: Tooltip, event: MouseEvent) {
                tooltip.getTooltip().classList.add("chart-time-legend-tooltip");
            },
            onMove(tooltip: Tooltip, event: MouseEvent) {
                const div: HTMLDivElement = me.findDom(event, "chart-time-icon-wrap", "chart-time-legend-tool");

                if (div) {
                    tooltip.update([div.getAttribute("data-tooltip")]);
                    return true;
                }

                return false;
            },
        };

        this.tooltip = new Tooltip(this.tool, config);
    }

    private onStartDrag(event: MouseEvent): void {
        if (this.draggable) {
            this.dragDrop.start(event, -this.width, 0);
        }
    }

    private onMove(event: MouseEvent, width: number, height: number): void {
        this.setWidth(-1 * width);
    }

    private getMarkupItem(s: ISeries): string {
        return "<div class=\"chart-time-legend-item\" data-key=\"" + s.id + "\">" +
            "<div class=\"chart-time-legend-item-color\"" +
                " style=\"background-color: " + s.color + ";opacity: " + s.opacity + "\">" +
            "&nbsp;</div>" +
            "<span class=\"chart-time-legend-item-text\">" + s.title + "</span>" +
         "</div>";
    }

    private findDom(event: MouseEvent, findClass: string, rootClass: string): HTMLDivElement {
        let div: HTMLDivElement = event.target as HTMLDivElement;

        do {
            if (div.classList.contains(findClass)) {
                return div;
            }

            if (div.classList.contains(rootClass)) {
                return null;
            }

            div = div.parentNode as HTMLDivElement;
        } while (div);

        return null;
    }

    private findSeries(div: HTMLDivElement): ISeries {
        const id: string = div.getAttribute("data-key");
        const ln: number = this.series.length;
        for (let i: number = 0, s: ISeries; i < ln; ++i) {
            s = this.series[i];
            if (s.id === id) {
                return s;
            }
        }

        return null; // !!!
    }

    private onHideSeries(event: MouseEvent): void {
        const div: HTMLDivElement = this.findDom(event, "chart-time-legend-item", "chart-time-legend-content");
        if (div) {
            const s: ISeries = this.findSeries(div);
            s.show = s.show === false;
            div.setAttribute("class", "chart-time-legend-item" + (s.show ? "" : " chart-time-legend-item-off"));

            if (this.events.onHideSeries) {
                this.events.onHideSeries(this);
            }
        }
    }

    private onSelectSeries(event: MouseEvent): void {
        const div: HTMLDivElement = this.findDom(event, "chart-time-legend-item", "chart-time-legend-content");
        let selected: ISeries = null;

        if (div) {
            const s: ISeries = this.findSeries(div);
            if (s.show !== false) {
                selected = s;
            }
        }

        this.setSelected(selected);
    }

    private onDeselectSeries(event: MouseEvent): void {
        this.setSelected(null);
    }

    private setSelected(selected: ISeries): void {
        if (this.selected !== selected) {
            this.selected = selected;

            if (this.events.onSelectSeries) {
                this.events.onSelectSeries(this);
            }
        }
    }

    private _setWidth(width: number): boolean {
        if (width > this.maxWidth) {
            width = this.maxWidth;
        }

        let hide: boolean = false;
        if (width < this.minWidth) {
            hide = true;
            width = 10;

            if (this.isShowAnyBtn()) {
                width += 35;
            }
        }

        if (this.width !== width) {
            this.container.style.width = width + "px";
            this.content.style.display = hide ? "none" : "";

            const className: string = "chart-time-legend-tool-small";
            hide ? this.tool.classList.add(className) : this.tool.classList.remove(className);

            this.width = width;
            return true;
        }

        return false;
    }

    private _show(show: boolean): boolean {
        if (this.isShow !== show) {
            this.isShow = show;
            this.container.style.display = this.isShow ? "" : "none";
            return true;
        }

        return false;
    }

    private isShowAnyBtn(): boolean {
        const ch: HTMLCollection = this.tool.children;
        const ln: number = ch.length;
        for (let i: number = 0; i < ln; ++i) {
            if ((ch[i] as HTMLDivElement).style.display !== "none") {
                return true;
            }
        }

        return false;
    }

    private showTool(show: boolean): void {
        let className: string;

        className = "chart-time-legend-tool-hide";
        show ? this.tool.classList.remove(className) : this.tool.classList.add(className);
        className = "chart-time-legend-wrap-top";
        show ? this.content.classList.remove(className) : this.content.classList.add(className);
    }
}
