const MIN_VALUE: number = -Number.MAX_VALUE;
const MAX_VALUE: number = Number.MAX_VALUE;

export { MIN_VALUE, MAX_VALUE };

const canvasTest: HTMLCanvasElement = document.createElement("canvas");
const ctxTest: CanvasRenderingContext2D = canvasTest.getContext("2d");

canvasTest.setAttribute("width", "200");
canvasTest.setAttribute("height", "200");

export { ctxTest };

export function createDOM(template: string): Element {
    const div: HTMLDivElement = document.createElement("div");
    div.innerHTML = template;
    return div.children[0] as Element;
}

interface IObject {
    [propName: string]: any;
}

export function mergeIf(to: IObject, ...from: IObject[]): any {
    let i = 0;
    const ln = from.length;
    let object: IObject;

    for (; i < ln; ++i) {
        object = from[i];

        for (const key in object) {
            if (object.hasOwnProperty(key) && !to.hasOwnProperty(key)) {
                to[key] = object[key];
            }
        }
    }

    return to;
}

export function isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
}

function leftPad(u: number): string {
    return (u > 9 ? "" : "0") + u.toString();
}

export function formatTime(date: Date): string {
    return leftPad(date.getHours()) + ":" + leftPad(date.getMinutes()) + ":" + leftPad(date.getSeconds());
}

export function formatDate(date: Date): string {
    return leftPad(date.getDate()) + "." + leftPad(date.getMonth() + 1) + "." + (date.getFullYear() % 100);
}

export function delay(t: number, callback: (...args: any[]) => void): () => void {
    let time: number = null;

    return (...args: any[]): number => {
        if (time !== null) {
            clearTimeout(time);
            time = null;
        }

        time = setTimeout(() => {
            time = null;
            callback.apply(null, args);
        }, t);

        return time;
    };
}
