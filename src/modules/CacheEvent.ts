import * as event from "../utils/event";

interface ICache {
    element: Element;
    listeners: any;
}

export class CacheEvent {
    private cache: ICache[];

    constructor() {
        this.cache = [];
    }

    public on(element: Element, listeners: any): void {
        this.cache.push({ element, listeners });
        event.on(element, listeners);
    }

    public off(): void {
        const ln: number = this.cache.length;
        let i: number = 0;
        let cache: ICache;

        for (; i < ln; ++i) {
            cache = this.cache[i];
            event.off(cache.element, cache.listeners);
            cache.element = null;
            cache.listeners = null;
        }

        this.cache = [];
    }

    public pop(): void {
        if (this.cache.length === 0) {
            return;
        }

        const cache: ICache = this.cache.pop();
        event.off(cache.element, cache.listeners);
        cache.element = null;
        cache.listeners = null;
    }
}
