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
        isInit: true,
        show: true,
        className: null,
    };

    public static template: string;

    public static create(config?: IConfig): Widget {
        const ctor = this as any;
        return new ctor(config);
    }

    private static id: number = 0;

    public id: string;
    public isShow: boolean;
    public className: string;
    public container: HTMLElement;

    protected cacheEvent: CacheEvent;

    constructor(config?: IConfig) {
        this.id = (++Widget.id).toString(36);
        this.cacheEvent = new CacheEvent();
        this.init(this.mergeConfig(config));
    }

    public init(config: IConfig): void {
        this.className = config.className;
        this.show(config.show);

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
        this.afterRender();
    }

    public abstract afterRender(): void;

    public show(show?: boolean): void {
        this.isShow = show !== false;

        if (this.container) {
            const className = Widget.prefixClass + "-hide";

            if (this.isShow) {
                this.removeClass(this.container, className);
            } else {
                this.addClass(this.container, className);
            }
        }
    }

    public hide(hide?: boolean): void {
        this.show(hide !== false);
    }

    public self(): any { // TODO
        return Object.getPrototypeOf(this).constructor;
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
        this.cacheEvent.off();

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
