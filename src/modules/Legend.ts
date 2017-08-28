import { Widget, IConfig } from "./Widget";

import { Drag } from "./Drag";
import { Button } from "./buttons/Button";
import { ISeries } from "../series/index";

import { isNumeric } from "../utils/util";

import "../less/legend.less";

export class Legend extends Widget {

    public static config: IConfig = {
        width: 250,
        minWidth: 80,
        maxWidth: 300,
        draggable: true,
        // events: {
        //     onChangeWidth: (legend: Legend) => {},
        //     onSelectSeries: (legend: Legend) => {},
        //     onHideSeries: (legend: Legend) => {}, // show or hide
        // },
    };

    public static template: string = [
        "<div class=\"chart-time-legend\">",
            "<div class=\"chart-time-legend-wrap\">", // chart-time-legend-wrap-top
                "<div class=\"chart-time-legend-content\"></div>",
            "</div>",
            "<div class=\"chart-time-legend-drag\"></div>",
            "<div class=\"chart-time-legend-tool\"></div>", // chart-time-legend-tool-hide
        "</div>",
    ].join("");

    public minWidth: number;
    public maxWidth: number;
    public isDraggable: boolean;

    public dragDrop: Drag;

    public series: ISeries[];
    public selected: ISeries;

    private buttons: Button[];

    private content: HTMLDivElement;
    private tool: HTMLDivElement;
    private drag: HTMLDivElement;

    public init(config: IConfig): void {
        this.dragDrop = new Drag(this.onMove.bind(this));

        this.buttons = [];
        this.selected = null;
        this.minWidth = config.minWidth;
        this.maxWidth = config.maxWidth;
        this.isDraggable = config.dragable;

        super.init(config);
    }

    public afterRender(): void {
        this.content = this.container.querySelector(".chart-time-legend-content") as HTMLDivElement;
        this.tool = this.container.querySelector(".chart-time-legend-tool") as HTMLDivElement;
        this.drag = this.container.querySelector(".chart-time-legend-drag") as HTMLDivElement;

        this.initEvent();
        this.daggable(this.isDraggable);
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
        const w: number = this.width;
        this.setSize(width, null);
        if (w !== this.width) {
            this.fire("onChangeWidth", this.width);
        }
    }

    public setSize(width: number, height: number): void {
        const classSmall: string = "chart-time-legend-tool-small";
        let hide: boolean = false;

        if (width > this.maxWidth) {
            width = this.maxWidth;
        }

        if (width < this.minWidth) {
            hide = true;
            width = 10;

            if (this.isShowAnyBtn()) {
                width += 35;
            }
        }

        if (this.container) {
            hide ? this.addClass(this.tool, classSmall) : this.removeClass(this.tool, classSmall);
        }

        super.setSize(width, null);
    }

    public show(show: boolean) {
        const s: boolean = this.isShow;
        super.show(show);
        if (s !== this.isShow) {
            this.fire("onChangeWidth", this.width);
        }
    }

    public addBtn(btn: Button): void {
        this.buttons.push(btn);
        btn.bindTo(this.tool);
        this.showBtn(btn.isShow, this.tool.children.length - 1);
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

    public daggable(dragable: boolean): void {
        this.isDraggable = dragable !== false;
        const classDrag: string = "chart-time-legend-drag-draggable";
        this.isDraggable ? this.addClass(this.drag, classDrag) : this.removeClass(this.drag, classDrag);
    }

    public destroy(): void {
        this.dragDrop.destroy();
        this.dragDrop = null;

        this.buttons.forEach((btn: Button) => {
            btn.destroy();
        });
        this.buttons = null;

        this.series = null;
        this.selected = null;

        this.content = null;
        this.tool = null;
        this.drag = null;

        super.destroy();
    }

    private initEvent(): void {
        this.cacheEvent.on(this.drag, {
            mousedown: this.onStartDrag.bind(this),
        });

        this.cacheEvent.on(this.content, {
            click: this.onHideSeries.bind(this),
            mouseover: this.onSelectSeries.bind(this),
            mouseout: this.onDeselectSeries.bind(this),
        });
    }

    private onStartDrag(event: MouseEvent): void {
        if (this.isDraggable) {
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
            "</div>" +
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
