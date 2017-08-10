import { Widget, IConfig } from "./../Widget";
import { ChartTime } from "./../../ChartTime";

export abstract class Button extends Widget {

    public static config: IConfig = {
        chartTime: null,
    };

    public static template: string = "<div class=\"chart-time-icon-wrap\"></div>";

    public static icon: string;

    public chartTime: ChartTime;
    public tooltip: string;

    public init(config: IConfig): void {
        super.init(config);

        this.chartTime = config.chartTime;
        this.tooltip = config.tooltip;
    }

    public afterRender(): void {
        this.container.innerHTML = this.self().icon;

        if (this.tooltip) {
            this.container.setAttribute("data-tooltip", this.tooltip);
        }
    }

    public destroy(): void {
        super.destroy();
        this.chartTime = null;
    }
}
