import { Widget, IConfig } from "./Widget";

import "../less/tooltip.less";

interface ICoordinate {
    x: number;
    y: number;
}

let time: number = 0;

export class Tooltip extends Widget {

    public static config: IConfig = {
        target: null,       // DOM елемент, при наведении на который будет появляться тултип
        margin: 15,         // отступ от координаты мыши
        hideByClick: false, // скрывать тултип по клику
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
    public hideByClick: boolean;
    public showDelay: number; // время через которое тултип будет показан
    public hideDelay: number; // время через которое тултип будет спрятан
    public saveDelay: number; // время игнорирования showDelay перескакивая между тултипами

    private showDelayTime: number; // таймер для showDelay
    private hideDelayTime: number; // таймер для hideDelay

    private lastEvent: MouseEvent; // последнее событие
    private blocking: boolean;     // блокирование создания тултипа

    public init(config: IConfig): void {
        config.bindTo = null;
        super.init(config);

        this.margin = config.margin;
        this.hideByClick = config.hideByClick;

        this.showDelay = config.showDelay;
        this.hideDelay = config.hideDelay;
        this.saveDelay = config.saveDelay;

        this.showDelayTime = null;
        this.hideDelayTime = null;

        this.blocking = false;

        if (config.target) {
            this.setTarget(config.target);
        }
    }

    public afterRender(): void {
        // empty
    }

    public update(html: string[]): void {
        this.container.innerHTML = html.join("");
    }

    public remove(): void {
        this.removeTooltip(null);
    }

    public setTarget(target: HTMLElement): void {
        this.cacheEvent.on(target, {
            mousedown: (event: MouseEvent) => {
                if (this.hideByClick) {
                    this.blocking = true;
                    this.onMouseLeave(event);
                }
            },
            mousemove: (event: MouseEvent) => {
                if (!this.blocking) {
                    this.onMouseMove(event);
                }
            },
            mouseleave: (event: MouseEvent) => {
                time = this.blocking ? 0 : (new Date()).getTime();

                this.blocking = false;
                this.onMouseLeave(event);
            },
        });
    }

    public destroy(): void {
        this.onMouseLeave(null);
        super.destroy();
    }

    // -----------------------
    private onMouseMove(event: MouseEvent): void {
        this.lastEvent = event;

        if (this.container) {
            this.moveTooltip(event);
        } else {
            this.delayCreateTooltip(event);
        }
    }

    private onMouseLeave(event: MouseEvent): void {
        this.delayCreateTooltipStop();
        this.delayRemoveTooltipStop();

        this.removeTooltip(event);
        this.lastEvent = null;
    }

    // -----------------------
    // отложенный вызов тултипа
    private delayCreateTooltip(event: MouseEvent): void {
        if (this.showDelay === 0) {
            this.createTooltip(event);
            return;
        }

        if (this.saveDelay > 0 && (new Date()).getTime() - time <= this.saveDelay) {
            this.createTooltip(event);
            return;
        }

        if (this.showDelayTime === null) {
            this.showDelayTime = setTimeout(() => {
                this.showDelayTime = null;
                this.createTooltip(this.lastEvent);
            }, this.showDelay);
        }
    }

    // остановка отложенного вызова тултипа
    private delayCreateTooltipStop(): void {
        if (this.showDelayTime !== null) {
            clearTimeout(this.showDelayTime);
            this.showDelayTime = null;
        }
    }

    // отложенное закрытие тултипа
    private delayRemoveTooltip(): void {
        if (this.hideDelay === 0) {
            return;
        }

        this.hideDelayTime = setTimeout(() => {
            this.hideDelayTime = null;
            this.removeTooltip(this.lastEvent);
            this.blocking = true;
        }, this.hideDelay);
    }

    // остановка отложенного закрытия тултипа
    private delayRemoveTooltipStop(): void {
        if (this.hideDelayTime !== null) {
            clearTimeout(this.hideDelayTime);
            this.hideDelayTime = null;
        }
    }

    // -----------------------
    private createTooltip(event: MouseEvent): void {
        this.bindTo(document.body);
        this.fire("onCreate", event);

        this.delayRemoveTooltip();
        this.moveTooltip(event);
    }

    private moveTooltip(event: MouseEvent): void {
        this.fire("onMove", event);

        const newCoordinate: ICoordinate = this.correction(event.clientX, event.clientY);

        this.container.style.left = newCoordinate.x + "px";
        this.container.style.top = newCoordinate.y + "px";
    }

    private removeTooltip(event: MouseEvent): void {
        if (!this.container) {
            return;
        }

        this.fire("onRemove");

        this.container.parentNode.removeChild(this.container);
        this.container = null;
    }

    // -----------------------
    private correction(x: number, y: number): ICoordinate {
        const clientRect: ClientRect = this.container.getBoundingClientRect();

        const bodyWidth: number = document.body.offsetWidth;
        const bodyHeight: number = document.body.offsetHeight;

        const endX: number = clientRect.width + x + this.margin;
        const endY: number = clientRect.height + y + this.margin;

        const needCorrectX: boolean = endX > bodyWidth;
        const needCorrectY: boolean = endY > bodyHeight;

        if (needCorrectX) {
            if (needCorrectY) {
                return {
                    x: x - clientRect.width - this.margin,
                    y: y - clientRect.height - this.margin,
                };
            } else {
                return {
                    x: x - (endX - bodyWidth),
                    y: y + this.margin,
                };
            }
        } else {
            if (needCorrectY) {
                return {
                    x: x + this.margin,
                    y: y - (endY - bodyHeight),
                };
            } else {
                return {
                    x: x + this.margin,
                    y: y + this.margin,
                };
            }
        }
    }
}
