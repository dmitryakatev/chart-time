import { Widget, IConfig } from "./../Widget";

export class Button extends Widget {

    public static template: string = [
        "<input type=\"button\" value=\"click me\" />",
    ].join("");

    public init(config: IConfig): void {
        super.init(config);
    }
}
