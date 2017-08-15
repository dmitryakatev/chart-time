import { Widget, IConfig } from "./../../src/modules/Widget";

class TestWidget extends Widget {

    public afterRender(): void {
        // empty code
    }

}

describe("widget abstract class unit test", () => {

    it("must be created without config", () => {
        let widget: TestWidget;

        try {
            widget = new TestWidget();
        } catch (e) {
            console.log(e);
        }

        expect(widget).not.toBe(null);
        expect(widget instanceof Widget).not.toBeTruthy();
    });

    it("must be called init method", () => {
        let mergedConfig: IConfig = {};
        const defaultConfig: IConfig = {
            customConfig: "customConfig",
            events: {
                onInitEvent: () => { /**/ },
            },
        };

        spyOn(Widget.prototype, "init").and.callFake((c: IConfig) => {
            mergedConfig = c;
        });

        const widget: TestWidget = new TestWidget(defaultConfig);

        expect(widget.init).toHaveBeenCalled();

        const merged: boolean = Object.keys(mergedConfig).every((prop: string) => {
            if (defaultConfig.hasOwnProperty(prop)) {
                return defaultConfig[prop] === mergedConfig[prop];
            }

            if (Widget.config.hasOwnProperty(prop)) {
                return Widget.config[prop] === mergedConfig[prop];
            }

            return false;
        });

        expect(merged).toBeTruthy();
    });
});
