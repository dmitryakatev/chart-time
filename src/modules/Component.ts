import { isEnablePrintWarn } from "./PrintWarn";

export class Component {

    private static id: number = 0;

    public id: string;

    constructor() {
        this.id = (++Component.id).toString(36);
    }

    // TODO
    public self(): any {
        return Object.getPrototypeOf(this).constructor;
    }

    public destroy(): void {
        if (this.id === null) {
            if (isEnablePrintWarn()) {
                console.warn("component destroyed!");
                console.warn(this);
            }

            return;
        }

        this.id = null;
    }
}
