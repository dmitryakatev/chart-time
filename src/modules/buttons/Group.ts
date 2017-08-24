import { IConfig } from "./../Widget";
import { Button } from "./Button";
import { ChartGroup } from "./../../ChartGroup";

import "./../../less/icons/group.less";

export class Group extends Button {

    public static config: IConfig = {
        tooltip: {
            title: "Вкл/Выкл группировку",
        },
        chartGroup: null,
    };

    public static icon: string = "<div class=\"chart-time-icon chart-time-icon-group\"></div>";

    public chartGroup: ChartGroup;

    public init(config?: IConfig): void {
        super.init(config);
        this.chartGroup = config.chartGroup;
    }

    public afterRender(): void {
        super.afterRender();

        this.cacheEvent.on(this.container, {
            click: (event: MouseEvent) => {
                console.log(111);
            },
        });
    }

    public destroy(): void {
        this.chartGroup = null;
        super.destroy();
    }
}
