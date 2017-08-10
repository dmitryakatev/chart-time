import { isEnablePrintWarn } from "./PrintWarn";

import { createDOM, mergeIf } from "./../utils/util";

export interface IConfig {
    [propName: string]: any;
}

export abstract class Widget {

    public static prefixClass: string = "chart-time";

    public static config = {
        bindTo: null,
        isInit: true,
        show: true,
        className: null,
    };

    public static template: string;

    public static create(config: IConfig): Widget {
        console.log(this);
        // return new (this)(config);
        return null;
    }

    private static id: number = 0;

    public id: string;
    public isShow: boolean;
    public className: string;
    public container: HTMLElement;

    constructor(config?: IConfig) {
        this.id = (++Widget.id).toString(36);
        this.init(this.mergeConfig(config));
    }

    public init(config: IConfig): void {
        this.className = config.className;

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
    }

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
