import { Widget, IConfig } from "./../Widget";
import { Tooltip } from "./../Tooltip";
import { ChartTime } from "./../../ChartTime";

import { mergeIf } from "./../../utils/util";

import "./../../less/icons/icon.less";

export interface IButtonCtor {
    new (config: IConfig): Button;
}

export abstract class Button extends Widget {

    public static config: IConfig = {
        chartTime: null,
        tooltip: {
            hideByClick: true,
            showDelay: 2000,
            hideDelay: 2000,
            saveDelay: 3000,
        },
    };

    public static template: string = "<div class=\"chart-time-icon-wrap\"></div>";

    public static icon: string;

    public chartTime: ChartTime;
    public tooltip: Tooltip;
    public title: string;

    public init(config: IConfig): void {
        super.init(config);

        this.chartTime = config.chartTime;
        this.title = config.title;

        this.tooltip = new Tooltip(mergeIf({
            target: null,
            show: !!this.title,
            events: {
                onCreate: (tooltip: Tooltip, event: MouseEvent) => {
                    this.addClass(tooltip.container, "chart-time-button-tooltip");
                    tooltip.update([this.title]);
                },
            },
        }, config.tooltip || {}, Button.config.tooltip));
    }

    public afterRender(): void {
        this.container.innerHTML = this.self().icon;
        this.tooltip.setTarget(this.container);
    }

    public destroy(): void {
        super.destroy();
        this.chartTime = null;

        if (this.tooltip) {
            this.tooltip.destroy();
        }
    }
}
