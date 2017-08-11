import { Widget, IConfig } from "./../Widget";
import { Tooltip } from "./../Tooltip2";
import { ChartTime } from "./../../ChartTime";

import "./../../less/icons/icon.less";

export abstract class Button extends Widget {

    public static config: IConfig = {
        chartTime: null,
    };

    public static template: string = "<div class=\"chart-time-icon-wrap\"></div>";

    public static icon: string;

    public chartTime: ChartTime;
    public tooltip: Tooltip;
    public title: string;

    public init(config: IConfig): void {
        super.init(config);

        this.chartTime = config.chartTime;
        this.title = config.tooltip;
    }

    public afterRender(): void {
        this.container.innerHTML = this.self().icon;

        if (this.title) {
            this.container.setAttribute("data-tooltip", this.title);
            this.tooltip = new Tooltip({
                target: this.container,
                events: {
                    onCreate: (tooltip: Tooltip) => {
                        console.log(tooltip);
                    },
                },
            });
        }
    }

    public destroy(): void {
        super.destroy();
        this.chartTime = null;

        if (this.tooltip) {
            this.tooltip.destroy();
        }
    }
}
