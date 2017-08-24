import { IConfig } from "./../Widget";
import { Button } from "./Button";

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
        tooltip: {
            title: "Качество фильрации точек",
        },
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
    public static classNameItemSelected: string = Damage.classNameItem + "-selected";

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

        this.cacheEvent.on(this.context, {
            click: (event: MouseEvent) => {
                const target: HTMLDivElement = event.target as HTMLDivElement;
                const damage = target.getAttribute("data-damage");

                if (damage && damage.length > 0) {
                    const selector: string = "." + Damage.classNameItemSelected;
                    const selected: HTMLDivElement = this.context.querySelector(selector) as HTMLDivElement;

                    if (selected) {
                        this.removeClass(selected, Damage.classNameItemSelected);
                    }
                    this.addClass(target, Damage.classNameItemSelected);

                    this.chartTime.settings.filterQuality = parseInt(damage, 10);
                    // this.chartTime.fire("onChangeSetting");
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
        className += option.damage === this.chartTime.settings.showBtnQuality ? " " + Damage.classNameItemSelected : "";

        return [
            "<div",
                " class=\"" + className + "\"",
                " data-damage=\"" + option.damage.toString() + "\">",
                option.text,
            "</div>",
        ].join("");
    }
}
