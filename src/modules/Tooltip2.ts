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

    private showDelayTime: number;
    private hideDelayTime: number;

    private disableShow: boolean;

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

    //отложенный вызов тултипа
    public delayShow(event: MouseEvent): void {
        if (this.showDelay > 0) {
            if (this.disableShow) {
                this.showDelayTime = setTimeout(() => {
                    this.disableShow = false;
                }, this.showDelay);
            }

            
            return;
        }
    }

    public delayShowStop(): void {
        this.disableShow = true;
        if (this.showDelayTime !== null) {
            clearTimeout(this.showDelayTime);
            this.showDelayTime = null;
        }
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
        this.container = null;
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
