import { Widget, IConfig } from "./../../src/modules/Widget";
import { mergeIf } from "./../../src/utils/util";

class TestWidget extends Widget {

    public static config: IConfig = {
        testConfig: true,
        customConfig: "test Config",
    };

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

        expect(widget).not.toBeNull();
        expect(widget instanceof Widget).toBeTruthy();
    });

    it("must be called init method", () => {
        const defaultConfig: IConfig = {
            customConfig: "customConfig",
            events: {
                onInitEvent: () => { /**/ },
            },
        };

        const shouldBeConfig: IConfig = mergeIf({}, defaultConfig, TestWidget.config, Widget.config);
        let isValidConfig: boolean;

        spyOn(Widget.prototype, "init").and.callFake((config: IConfig) => {
            const configKeys: string[] = Object.keys(config);

            if (Object.keys(shouldBeConfig).length !== configKeys.length) {
                isValidConfig = false;
                return config;
            }

            isValidConfig = configKeys.every((prop: string) => {
                return (shouldBeConfig.hasOwnProperty(prop)) && shouldBeConfig[prop] === config[prop];
            });
        });

        const widget: TestWidget = new TestWidget(defaultConfig);

        expect(widget.init).toHaveBeenCalled();
        expect(isValidConfig).toBeTruthy();
    });
});
