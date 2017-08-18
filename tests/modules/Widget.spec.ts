import { Widget, IConfig } from "./../../src/modules/Widget";
import { CacheEvent } from "./../../src/modules/CacheEvent";
import { mergeIf } from "./../../src/utils/util";

const div: HTMLDivElement = document.createElement("div") as HTMLDivElement;
const classHide: string = Widget.prefixClass + "-hide";

class TestWidget extends Widget {

    public static template: string = "<div>test</div>";

    public static config: IConfig = {
        testConfig: true,
        customConfig: "test Config",
    };

    public afterRender(): void {
        // empty line
    }

    public addCl(el: HTMLElement, className: string): void {
        this.addClass(el, className);
    }

    public removeCl(el: HTMLElement, className: string): void {
        this.removeClass(el, className);
    }

    public hasCl(el: HTMLElement, className: string): boolean {
        return this.hasClass(el, className);
    }
}

describe("widget abstract class unit test", () => {

    it("must be created", () => {
        let widget: TestWidget = null;

        const configs: IConfig[] = [null, {}, {
            bindTo: div,
            myEvent: () => {
                // empty line
            },
        }];

        configs.forEach((config: IConfig) => {
            try {
                widget = new TestWidget(config);
            } catch (e) {
                console.log(e);
            }

            expect(widget).not.toBeNull();
            expect(widget instanceof Widget).toBeTruthy();

            if (widget) {
                widget.destroy();
                widget = null;
            }
        });
    });

    describe("must be called init method", () => {

        it("and merged config", () => {
            const config: IConfig = {
                customConfig: "customConfig",
                events: {
                    onInitEvent: () => {
                        // empty line
                    },
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

                return c;
            });

            let widget: TestWidget = new TestWidget(config);

            expect(widget.init).toHaveBeenCalled();
            expect(isValidConfig).toBeTruthy();

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

            expect(widget.id).toBe(((Widget as any).id).toString(36));
            expect(widget.className).toBe(config.className);
            expect(widget.isShow).toBe(config.show);
            expect(widget.events).toBe(config.events);
            expect(widget.width).toBe(config.width);
            expect(widget.height).toBe(config.height);

            widget.destroy();
            widget = null;
        });

        it("and methods should work correctly", () => {

            function myEvent(ths: Widget, a1: number, a2: string) {
                // empty line
            }

            let widget: TestWidget = new TestWidget({
                bindTo: div,
                events: {
                    eventOne: myEvent,
                    eventTwo: myEvent,
                },
            });

            const arg1: number = 1;
            const arg2: string = "string";
            let rightArgs: boolean;

            spyOn(widget.events, "eventOne").and.callFake((ths: Widget, a1: number, a2: string) => {
                rightArgs = ths === widget && arg1 === a1 && arg2 === a2;
            });

            spyOn(widget.events, "eventTwo");

            widget.show();
            expect(widget.hasCl(widget.container, classHide)).toBeFalsy();
            widget.show(false);
            expect(widget.hasCl(widget.container, classHide)).toBeTruthy();
            widget.show(true);
            expect(widget.hasCl(widget.container, classHide)).toBeFalsy();

            widget.hide();
            expect(widget.hasCl(widget.container, classHide)).toBeTruthy();
            widget.hide(false);
            expect(widget.hasCl(widget.container, classHide)).toBeFalsy();
            widget.hide(true);
            expect(widget.hasCl(widget.container, classHide)).toBeTruthy();

            widget.addCl(widget.container, "myClass");
            expect(widget.hasCl(widget.container, "myClass")).toBeTruthy();
            widget.removeCl(widget.container, "myClass");
            expect(widget.hasCl(widget.container, "myClass")).toBeFalsy();

            widget.setSize(10, 10);
            expect(widget.container.style.width).toBe("10px");
            expect(widget.container.style.height).toBe("10px");
            widget.setSize(null, null);
            expect(widget.container.style.width).toBe("");
            expect(widget.container.style.height).toBe("");

            widget.fire("eventOne", arg1, arg2);
            expect(rightArgs).toBeTruthy();

            const eventTwo = widget.events.eventTwo;
            delete widget.events.eventTwo;
            widget.fire("eventTwo", arg1, arg2);
            expect(eventTwo).not.toHaveBeenCalled();

            widget.destroy();
            widget = null;
        });

        it("and should render", () => {
            let widget: TestWidget;

            widget = new TestWidget({
                className: "myClass",
                show: false,
                width: 100,
                height: 100,
            });

            expect(widget.container).toBeNull();

            widget.bindTo(div);

            expect(widget.container).not.toBeNull();
            expect(widget.hasCl(widget.container, classHide)).toBeTruthy();
            expect(widget.hasCl(widget.container, "myClass")).toBeTruthy();
            expect(widget.container.style.width).toBe("100px");
            expect(widget.container.style.height).toBe("100px");

            widget.destroy();
            widget = null;

            widget = new TestWidget({
                bindTo: div,
            });

            expect(widget.container).not.toBeNull();

            widget.destroy();
            widget = null;
        });

    });

    it("must be destroyed", () => {
        let widget: TestWidget = new TestWidget({
            bindTo: div,
            myEvent: () => {
                // empty line
            },
        });

        spyOn((widget as any).cacheEvent, "off");
        const off = (widget as any).cacheEvent.off;

        widget.destroy();

        expect(widget.id).toBeNull();
        expect(widget.events).toBeNull();

        expect(off).toHaveBeenCalled();
        expect((widget as any).cacheEvent).toBeNull();

        expect(widget.container).toBeNull();
        expect(div.children.length).toBe(0);

        widget = null;
    });

});
