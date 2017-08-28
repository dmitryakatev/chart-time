import { Tooltip } from "./../../src/modules/Tooltip";

const div: HTMLDivElement = document.createElement("div") as HTMLDivElement;

describe("tooltip class unit test", () => {

    it("must be created", () => {
        const event: MouseEvent = new Event("mousemove", { bubbles: true, cancelable: false }) as MouseEvent;

        (event as any).clientX = 100;
        (event as any).clientY = 100;
    });

});
