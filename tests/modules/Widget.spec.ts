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

        if (widget) {
            widget.destroy();
        }
    });

    describe("must be called init method", () => {

        it("and merged config", () => {
            const config: IConfig = {
                customConfig: "customConfig",
                events: {
                    onInitEvent: () => { /**/ },
                },
            };

            const shouldBeConfig: IConfig = mergeIf({}, config, TestWidget.config, Widget.config);
            let isValidConfig: boolean;

            spyOn(Widget.prototype, "init").and.callFake((c: IConfig) => {
                const configKeys: string[] = Object.keys(c);

                if (Object.keys(shouldBeConfig).length !== configKeys.length) {
                    isValidConfig = false;
                    return c;
                }

                isValidConfig = configKeys.every((prop: string) => {
                    return (shouldBeConfig.hasOwnProperty(prop)) && shouldBeConfig[prop] === c[prop];
                });
            });

            let widget: TestWidget = new TestWidget(config);

            expect(widget.init).toHaveBeenCalled();
            expect(isValidConfig).toBeTruthy();

            widget.destroy();
            widget = null;
        });

        it("and save props", () => {
            const config: IConfig = {
                className: "myName",
                show: false,
                events: {},
                width: 10,
                height: 10,
            };

            let widget: TestWidget = new TestWidget(config);

            expect(widget.id).toBe((++(Widget as any).id).toString(36));
            expect(widget.className).toBe(config.className);
            expect(widget.isShow).toBe(config.show);
            expect(widget.events).toBe(config.events);
            expect(widget.width).toBe(config.width);
            expect(widget.height).toBe(config.height);

            widget.destroy();
            widget = null;
        });

        it("and should render", () => {
            // render
        });
        
    });
});
