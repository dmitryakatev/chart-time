type ActionFn = (element: any, type: string, handler: () => any) => void;
type wrapFn = (element: Element, type: any) => void;

function _on(element: any, type: string, handler: () => any): void {
    if (type === "wheel") {
        if ("onwheel" in document) {
            // type = "wheel";
        } else if ("onmousewheel" in document) {
            type = "mousewheel";
        } else {
            type = "MozMousePixelScroll";
        }
    }

    if (element.addEventListener) {
        element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    }
}

function _off(element: any, type: string, handler: () => any): void {
    if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
    }
}

function wrapEvent(action: ActionFn): wrapFn {
    return (function each(element: Element, listeners: any): void {
        for (const eventName in listeners) {
            if (listeners.hasOwnProperty(eventName)) {
                action(element, eventName, listeners[eventName]);
            }
        }
    });
}

const on: wrapFn = wrapEvent(_on);
const off: wrapFn = wrapEvent(_off);

export { on, off };
