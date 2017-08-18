import { isEnablePrintWarn } from "./PrintWarn";
import { CacheEvent } from "./CacheEvent";

import { createDOM, mergeIf } from "./../utils/util";

export interface IConfig {
    [propName: string]: any;
}

export abstract class Widget {

    public static prefixClass: string = "chart-time";

    public static config: IConfig = {
        bindTo: null,
        className: null,
        show: true,
        width: null,
        height: null,
        events: {},
    };

    public static template: string;

    // public static create<T extends Widget>(config?: IConfig): T {
    //     const Ctor = this as any;
    //     return new Ctor(config);
    // }

    private static id: number = 0;

    public id: string;
    public className: string;
    public isShow: boolean;

    public events: IConfig;

    public width: number;
    public height: number;

    public container: HTMLElement;

    protected cacheEvent: CacheEvent;

    constructor(config?: IConfig) {
        this.id = (++Widget.id).toString(36);
        this.cacheEvent = new CacheEvent();
        this.init(this.mergeConfig(config));
    }

    public init(config: IConfig): void {
        this.className = config.className;
        this.isShow = config.show;

        this.events = config.events;

        this.width = config.width;
        this.height = config.height;

        if (config.bindTo) {
            this.bindTo(config.bindTo);
        } else {
            this.container = null;
        }
    }

    public bindTo(bindTo: HTMLElement): void {
        this.container = createDOM(this.self().template) as HTMLElement;
        if (this.className) {
            this.addClass(this.container, this.className);
        }

        bindTo.appendChild(this.container);
        this.show(this.isShow);

        const w: number = this.width;
        const h: number = this.height;

        this.width = null;
        this.height = null;

        this.setSize(w, h);
        this.afterRender();
    }

    public abstract afterRender(): void;

    public show(show?: boolean): void {
        this.isShow = show !== false;

        if (this.container) {
            this.showEl(this.container, this.isShow);
        }
    }

    public hide(hide?: boolean): void {
        this.show(hide === false);
    }

    public setSize(width: number, height: number): void {
        if (this.container) {
            if (this.width !== width) {
                this.container.style.width = width === null ? "" : (width + "px");
            }

            if (this.height !== height) {
                this.container.style.height = height === null ? "" : (height + "px");
            }
        }

        this.width = width;
        this.height = height;
    }

    public self(): any { // TODO
        return Object.getPrototypeOf(this).constructor;
    }

    public fire(...args: any[]): void {
        const eventName: string = args[0] as string;
        if (!this.events || !this.events.hasOwnProperty(eventName)) {
            return;
        }

        args[0] = this;

        this.events[eventName].apply(null, args);
    }

    public destroy(): void {
        if (this.id === null) {
            if (isEnablePrintWarn()) {
                console.warn("widget destroyed!");
                console.warn(this);
            }

            return;
        }

        this.id = null;
        this.events = null;

        this.cacheEvent.off();
        this.cacheEvent = null;

        if (this.container !== null) {
            this.container.parentNode.removeChild(this.container);
        }
    }

    protected addClass(el: HTMLElement, className: string): void {
        if (!this.hasClass(el, className)) {
            el.classList.add(className);
        }
    }

    protected removeClass(el: HTMLElement, className: string): void {
        if (this.hasClass(el, className)) {
            el.classList.remove(className);
        }
    }

    protected hasClass(el: HTMLElement, className: string): boolean {
        return el.classList.contains(className);
    }

    protected showEl(el: HTMLElement, show: boolean): void {
        const className = Widget.prefixClass + "-hide";

        if (show) {
            this.removeClass(el, className);
        } else {
            this.addClass(el, className);
        }
    }

    private mergeConfig(config?: IConfig): IConfig {
        const configs: IConfig[] = [{}];

        if (config) {
            configs.push(config);
        }

        let ctor: any = this.self();
        while (ctor !== Object) {
            if (ctor.hasOwnProperty("config")) {
                configs.push(ctor.config);
            }

            ctor = ctor.prototype.self();
        }

        return mergeIf.apply(null, configs);
    }
}
