import { Widget, IConfig } from "./Widget";

import "../less/tooltip.less";

interface ICoordinate {
    x: number;
    y: number;
}

export class Tooltip extends Widget {

    public static config: IConfig = {
        target: null, // DOM елемент, при наведении на который будет появляться тултип
        margin: 15,   // отступ от координаты мыши
        showDelay: 0, // через сколько секунд показывать тултип после наведения
        hideDelay: 0, // через сколько секунд прятать тултип после показа
        saveDelay: 0, // сколько секунд игнорировать showDelay
        // events: {
        //     onCreate: (tooltip: Tooltip, event: MouseEvent) => {},
        //     onMove: (tooltip: Tooltip, event: MouseEvent) => {},
        //     onRemove: (tooltip: Tooltip, event: MouseEvent) => {},
        // },
    };

    public static template: string = "<div class=\"chart-time-tooltip\"></div>";

    public margin: number;
    public showDelay: number;
    public hideDelay: number;
    public saveDelay: number;

    private lastX: number;
    private lastY: number;

    public init(config: IConfig): void {
        config.bindTo = null;
        super.init(config);

        this.margin = config.margin;

        this.showDelay = config.showDelay;
        this.hideDelay = config.hideDelay;
        this.saveDelay = config.saveDelay;

        this.cacheEvent.on(config.target, {
            mousedown: (event: MouseEvent) => {
                // console.log(event);
                console.log("down");
            },
            mousemove: (event: MouseEvent) => {
                if (!this.isShow) {
                    return;
                }

                this.lastX = event.clientX;
                this.lastY = event.clientY;

                if (!this.container) {
                    this.createTooltip(event);
                }

                this.moveTooltip(event);
            },
            mouseleave: (event: MouseEvent) => {
                this.removeTooltip(event);
            },
        });
    }

    public afterRender(): void {
        // empty
    }

    public update(html: string[]): void {
        this.container.innerHTML = html.join("");
    }

    private createTooltip(event: MouseEvent): void {
        this.bindTo(document.body);
        this.fire("onCreate", event);
    }

    private moveTooltip(event: MouseEvent): void {
        this.fire("onMove", event);

        const newCoordinate: ICoordinate = this.correction();

        this.container.style.left = newCoordinate.x + "px";
        this.container.style.top = newCoordinate.y + "px";
    }

    private removeTooltip(event: MouseEvent): void {
        if (!this.container) {
            return;
        }

        this.container.parentNode.removeChild(this.container);
    }

    private correction(): ICoordinate {
        const clientRect: ClientRect = this.container.getBoundingClientRect();

        const bodyWidth: number = document.body.offsetWidth;
        const bodyHeight: number = document.body.offsetHeight;

        const endX: number = clientRect.width + this.lastX + this.margin;
        const endY: number = clientRect.height + this.lastY + this.margin;

        const needCorrectX: boolean = endX > bodyWidth;
        const needCorrectY: boolean = endY > bodyHeight;

        if (needCorrectX) {
            if (needCorrectY) {
                return {
                    x: this.lastX - clientRect.width - this.margin,
                    y: this.lastY - clientRect.height - this.margin,
                };
            } else {
                return {
                    x: this.lastX - (endX - bodyWidth),
                    y: this.lastY + this.margin,
                };
            }
        } else {
            if (needCorrectY) {
                return {
                    x: this.lastX + this.margin,
                    y: this.lastY - (endY - bodyHeight),
                };
            } else {
                return {
                    x: this.lastX + this.margin,
                    y: this.lastY + this.margin,
                };
            }
        }
    }
}
/*

import { CacheEvent } from "../modules/CacheEvent";
import { createDOM, mergeIf } from "../utils/util";


export interface ITooltipEvents {
    onCreate?: (legend: Tooltip, event: MouseEvent) => any;
    onMove?: (legend: Tooltip, event: MouseEvent) => any;
    onRemove?: (legend: Tooltip, event: MouseEvent) => any;
}

export interface ITooltipConfig {
    show?: boolean;
    margin?: number;
    showDelay?: number;
    saveDelay?: number;
    hideDelay?: number;
    events?: ITooltipEvents;
}

const template: string = [
    "<div class=\"chart-time-tooltip\"></div>",
].join("");

const defaultConfig = {
    show: true,
    margin: 15,
    showDelay: 0,
    saveDelay: 0,
    hideDelay: 0,
};

export class Tooltip {
    public show: boolean;
    public margin: number;
    public showDelay: number;
    public hideDelay: number;
    public saveDelay: number;
    public x: number;
    public y: number;

    public events: ITooltipEvents;

    private cacheEvent: CacheEvent;

    private timeShow: number = null;
    private timeHide: number = null;
    private timeEnabledDelay: number = null;
    private enabledDelay: boolean = true;
    private blockShow: boolean = false;

    private container: HTMLDivElement;
    private tooltip: HTMLDivElement;

    constructor(bindTo: Element, config: ITooltipConfig) {
        config = mergeIf(config, defaultConfig);
        this.events = config.events || {};

        this.container = bindTo as HTMLDivElement;
        this.tooltip = null;

        this.initEvent();

        this.show = config.show;
        this.margin = config.margin;
        this.showDelay = config.showDelay;
        this.hideDelay = config.hideDelay;
        this.saveDelay = config.saveDelay;
        this.x = 0;
        this.y = 0;
    }

    public update(html: string[]): void {
        this.tooltip.innerHTML = html.join("");
    }

    public getTooltip(): HTMLDivElement {
        return this.tooltip;
    }

    public hide(): void {
        this.removeTooltip(null);
    }

    public destroy(): void {
        if (this.container === null) {
            if (isEnablePrintWarn()) {
                console.log("tooltip destroyed!");
            }

            return;
        }

        this.removeTooltip(null);

        this.container = null;
        this.events = null;

        this.cacheEvent.off();
        this.cacheEvent = null;
    }

    private initEvent(): void {
        this.cacheEvent = new CacheEvent();

        this.cacheEvent.on(this.container, {
            mousedown: (event: MouseEvent) => {
                if (this.show && (this.isShow() || this.timeShow !== null)) {
                    this.blockShow = true;
                    this.visibilityDelay(true);
                }
            },
            mousemove: (event: MouseEvent) => {
                if (this.show) {
                    this.moveTooltip(event);
                }
            },
            mouseleave: (event: MouseEvent) => {
                this.removeTooltip(event);
            },
        });
    }

    private createTooltip(event: MouseEvent): void {
        this.tooltip = createDOM(template) as HTMLDivElement;
        document.body.appendChild(this.tooltip);

        if (this.events.onCreate) {
            this.events.onCreate(this, event);
        }
    }

    private moveTooltip(event: MouseEvent): void {
        if (!this.tooltip) {
            this.createTooltip(event);
        }

        this.x = event.clientX;
        this.y = event.clientY;

        this.visibilityDelay(this.events.onMove ? this.events.onMove(this, event) !== false : true);

        const coord: { x: number, y: number } = this.correction();

        this.tooltip.style.top = coord.y + "px";
        this.tooltip.style.left = coord.x + "px";
    }

    private removeTooltip(event: MouseEvent): void {
        if (this.tooltip === null) {
            return;
        }

        this.visibilityDelay(false);
        document.body.removeChild(this.tooltip);
        this.tooltip = null;

        if (this.events.onRemove) {
            this.events.onRemove(this, event);
        }
    }

    private visibilityDelay(show: boolean): void {
        if (show) {
            if (this.timeEnabledDelay !== null) {
                clearTimeout(this.timeEnabledDelay);
                this.timeEnabledDelay = null;
            }

            if (this.showDelay > 0 && this.enabledDelay) {
                show = false;
                if (this.timeShow === null) {
                    this.timeShow = setTimeout(() => {
                        this.timeShow = null;
                        this.enabledDelay = false;
                        this.visibilityDelay(true);
                    }, this.showDelay);
                }
            }

            if (this.hideDelay > 0 && show) {
                if (this.blockShow) {
                    show = false;
                } else {
                    if (this.timeHide === null) {
                        this.timeHide = setTimeout(() => {
                            this.timeHide = null;
                            this.blockShow = true;
                            this.visibilityDelay(true);
                        }, this.hideDelay);
                    }
                }
            }
        } else {
            if (!this.enabledDelay && this.timeEnabledDelay === null) {
                if (this.blockShow) {
                    this.enabledDelay = true;
                } else {
                    this.timeEnabledDelay = setTimeout(() => {
                        this.timeEnabledDelay = null;
                        this.enabledDelay = true;
                    }, this.saveDelay);
                }
            }

            if (this.timeShow !== null) {
                clearTimeout(this.timeShow);
                this.timeShow = null;
            }

            this.blockShow = false;
            if (this.timeHide !== null) {
                clearTimeout(this.timeHide);
                this.timeHide = null;
            }
        }

        if (show !== this.isShow()) {
            this.tooltip.style.display = show ? "" : "none";
        }
    }

    private isShow(): boolean {
        return this.tooltip.style.display === "";
    }

}
*/