import { IConfig } from "./../Widget";
import { Button } from "./Button";

import "./../../less/icons/full.less";

export class Full extends Button {

    public static config: IConfig = {
        title: "Первоначальный вид графика",
    };

    public static icon: string = [
        "<div class=\"chart-time-icon chart-time-icon-full\">",
            "<div class=\"chart-time-icon-full-square\"></div>",
        "</div>",
    ].join("");

    public afterRender(): void {
        super.afterRender();

        this.cacheEvent.on(this.container, {
            click: () => {
                this.chartTime.scale = 1;
                this.chartTime.offset = 1;
                // this.chartTime.redraw();
            },
        });
    }
}
