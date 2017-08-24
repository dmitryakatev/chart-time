import { Widget, IConfig } from "./../Widget";
import { Tooltip } from "./../Tooltip2";
import { ChartTime } from "./../../ChartTime";

import { mergeIf } from "./../../utils/util";

import "./../../less/icons/icon.less";

export abstract class Button extends Widget {

    public static config: IConfig = {
        chartTime: null,
        tooltip: {
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

        const tooltipConfig: IConfig = mergeIf({
            target: null,
            // show: !!this.title,
            events: {
                onCreate: (tooltip: Tooltip, event: MouseEvent) => {
                    tooltip.update([this.title]);
                },
            },
        },
            config.tooltip || {},
            Button.config.tooltip,
            this.self().config.tooltip,
        );

        this.chartTime = config.chartTime;
        this.title = tooltipConfig.title;

        tooltipConfig.show = !!this.title;
        this.tooltip = new Tooltip(tooltipConfig);
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
