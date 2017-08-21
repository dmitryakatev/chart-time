import { Component } from "./../../src/modules/Component";

describe("component class unit test", () => {

    it("must create/destroy the identifier", () => {
        let component: Component = new Component();

        expect(component.id).toBe(((Component as any).id).toString(36));

        component.destroy();

        expect(component.id).toBeNull();

        component = null;
    });

});
