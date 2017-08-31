import { IConfig } from "./../Widget";
import { Button } from "./Button";
import { ISeries } from "./../../series/BaseSeries";

import { on } from "./../../utils/event";

import "./../../less/icons/spanner.less";

interface IOption {
    text: string;
    damage: number;
}

let isHot: boolean = false;
let captured: Damage = null;

on(document, {
    click: () => {
        if (captured) {
            if (isHot) {
                isHot = false;
            } else {
                (captured as any).showEl((captured as any).context, false);
                captured = null;
            }
        }
    },
});

export class Damage extends Button {

    public static config: IConfig = {
        title: "Качество фильрации точек",
        options: [{
            text: "Высокое качество",
            damage: 1,
        }, {
            text: "Среднее качество",
            damage: 2,
        }, {
            text: "Низкое качество",
            damage: 4,
        }],
    };

    public static icon: string = [
        "<div class=\"chart-time-icon chart-time-icon-spanner\">",
            "<div class=\"chart-time-icon-spanner-context chart-time-hide\"></div>",
        "</div>",
    ].join("");

    public static classNameItem: string = Button.prefixClass + "-icon-spanner-context-item";
    public static classItemSelected: string = Damage.classNameItem + "-selected";

    private options: IOption[];
    private context: HTMLDivElement;

    public init(config?: IConfig): void {
        super.init(config);
        this.options = config.options;
    }

    public afterRender(): void {
        super.afterRender();

        this.context = this.container.children[0].children[0] as HTMLDivElement;

        this.context.innerHTML = this.options.map((option: IOption) => {
            return this.getMarkupItem(option);
        }).join("");

        this.select(this.chartTime.settings.filterQuality);

        this.cacheEvent.on(this.context, {
            click: (event: MouseEvent) => {
                const target: HTMLDivElement = event.target as HTMLDivElement;
                const damage: number = parseInt(target.getAttribute("data-damage") || "0", 10);

                if (damage > 0) {
                    this.select(damage);

                    this.chartTime.settings.filterQuality = damage;
                    this.chartTime.series.forEach((s: ISeries) => {
                        s.filterScale = -1;
                    });

                    this.chartTime.redraw();

                    this.chartTime.fire("onChangeSetting", "filterQuality", this.chartTime.settings.filterQuality);
                }
            },
        });

        this.cacheEvent.on(this.container, {
            click: () => {
                if (captured && captured.id === this.id) {
                    this.showEl(this.context, false);
                    captured = null;
                } else {
                    this.showEl(this.context, true);
                    captured = this;

                    isHot = true;
                }
            },
        });
    }

    public select(damage: number): void {
        const deSelect: HTMLDivElement = this.context.querySelector("." + Damage.classItemSelected) as HTMLDivElement;
        const toSelect: HTMLDivElement = this.context.querySelector(`div[data-damage="${damage}"]`) as HTMLDivElement;

        if (deSelect) {
            this.removeClass(deSelect, Damage.classItemSelected);
        }

        this.addClass(toSelect, Damage.classItemSelected);
    }

    public destroy(): void {
        if (captured && captured.id === this.id) {
            captured = null;
        }

        this.context = null;
        this.options = null;
        super.destroy();
    }

    private getMarkupItem(option: IOption): string {
        let className: string = Damage.classNameItem;
        className += option.damage === this.chartTime.settings.showBtnQuality ? " " + Damage.classItemSelected : "";

        return [
            "<div",
                " class=\"" + className + "\"",
                " data-damage=\"" + option.damage.toString() + "\">",
                option.text,
            "</div>",
        ].join("");
    }
}
